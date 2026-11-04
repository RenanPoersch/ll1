import { Component, provideZonelessChangeDetection } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { bootstrapApplication } from '@angular/platform-browser';
import { analyze, generateSentence, type Analysis } from './parser';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
})
class AppComponent {
  sentence = 'a+b';
  result: Analysis | null = analyze(this.sentence);
  selectedStep = 0;

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
