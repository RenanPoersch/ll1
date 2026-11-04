import assert from 'node:assert/strict';
import { test } from 'node:test';
import { analyze, generateSentence } from '../src/parser.ts';

test('aceita expressões válidas e registra a pilha até o fim', () => {
  for (const sentence of ['a', 'b', 'a+b*a', '((a+b)*b)', ' a + b ']) {
    const result = analyze(sentence);
    assert.equal(result.accepted, true, sentence);
    assert.deepEqual(result.steps[0].stack, 'S $');
    assert.deepEqual(result.steps.at(-1), { stack: '$', input: '$', action: 'Aceitar' });
  }
});

test('rejeita erros de sintaxe, símbolos inválidos e um marcador de fim digitado', () => {
  for (const sentence of ['', 'a+', '(a', 'a)', 'a b', 'a**b', 'a$', 'x', '()']) {
    const result = analyze(sentence);
    assert.equal(result.accepted, false, sentence);
    assert.equal(result.steps.at(-1).action, result.message);
  }
});

test('gera apenas sentenças reconhecidas pela própria gramática', () => {
  for (let count = 0; count < 250; count++) {
    const sentence = generateSentence();
    assert.equal(analyze(sentence).accepted, true, sentence);
  }
});
