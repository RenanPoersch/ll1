import { Component, provideZonelessChangeDetection } from '@angular/core';
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
  result: Analysis | null = analyze(this.sentence);
  selectedStep = 0;
  activePanel = 'grammar';
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

  get selectedRule() {
    return this.result?.steps[this.selectedStep]?.rule;
  }

  run(): void {
    this.result = analyze(this.sentence);
    this.selectedStep = 0;
  }

  generate(): void {
    this.sentence = generateSentence();
    this.result = null;
  }

  reset(input: HTMLInputElement): void {
    this.sentence = '';
    this.result = null;
    input.focus();
  }
}

bootstrapApplication(AppComponent, { providers: [provideZonelessChangeDetection()] })
  .catch(console.error);
