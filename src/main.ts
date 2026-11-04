import { afterNextRender, Component, DestroyRef, ElementRef, inject, Injector, provideZonelessChangeDetection, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { bootstrapApplication } from '@angular/platform-browser';
import { analyze, firstFollow, formatProduction, generateSentence, grammar, nonTerminals, tableCell, terminals, type Analysis } from './parser';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
})
class AppComponent {
  sentence = 'a+b';
  result: Analysis | null = null;
  selectedStep = 0;
  mode: 'manual' | 'automatic' = 'manual';
  readonly visibleCount = signal(0);
  private readonly trace = viewChild<ElementRef<HTMLElement>>('trace');
  private readonly injector = inject(Injector);
  private timer?: ReturnType<typeof setInterval>;
  activePanel = 'parsing';
  readonly panels = [
    { id: 'grammar', label: 'Gramática' },
    { id: 'parsing', label: 'Tabela de parsing' },
    { id: 'sets', label: 'FIRST / FOLLOW' },
  ];
  readonly grammar = grammar;
  readonly nonTerminals = nonTerminals;
  readonly terminals = terminals;
  readonly firstFollow = firstFollow;
  readonly formatProduction = formatProduction;
  readonly tableCell = tableCell;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.stopTimer());
  }

  get finished(): boolean {
    return this.result !== null && this.visibleCount() === this.result.steps.length;
  }

  get selectedLookup() {
    return this.result?.steps[this.selectedStep]?.lookup;
  }

  run(): void {
    this.clearAnalysis();
    this.result = analyze(this.sentence);
    this.advance();
    this.setMode(this.mode);
  }

  setMode(mode: 'manual' | 'automatic'): void {
    this.mode = mode;
    this.stopTimer();
    if (mode === 'automatic' && this.result && !this.finished) {
      this.timer = setInterval(() => this.advance(), 600);
    }
  }

  advance(): void {
    if (!this.result || this.finished) return;
    this.selectedStep = this.visibleCount();
    this.visibleCount.update(count => count + 1);
    if (this.finished) this.stopTimer();

    afterNextRender(() => {
      const container = this.trace()?.nativeElement;
      const row = container?.querySelector('tbody tr:last-child');
      if (container && row) {
        container.scrollTop += Math.max(0, row.getBoundingClientRect().bottom - container.getBoundingClientRect().bottom);
      }
    }, { injector: this.injector });
  }

  clearAnalysis(): void {
    this.stopTimer();
    this.result = null;
    this.selectedStep = 0;
    this.visibleCount.set(0);
    const container = this.trace()?.nativeElement;
    if (container) container.scrollTop = 0;
  }

  private stopTimer(): void {
    clearInterval(this.timer);
    this.timer = undefined;
  }

  generate(): void {
    this.sentence = generateSentence();
    this.clearAnalysis();
  }

  reset(input: HTMLInputElement): void {
    this.sentence = '';
    this.clearAnalysis();
    input.focus();
  }
}

bootstrapApplication(AppComponent, { providers: [provideZonelessChangeDetection()] })
  .catch(console.error);
