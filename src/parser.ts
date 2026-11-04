export const nonTerminals = ['S', 'A', 'B', 'C', 'D'] as const;
export const terminals = ['a', 'b', '+', '*', '(', ')', '$'] as const;
type NonTerminal = typeof nonTerminals[number];
type Terminal = typeof terminals[number];

export const grammar: Record<NonTerminal, readonly (readonly string[])[]> = {
  S: [['B', 'A']],
  A: [['+', 'B', 'A'], []],
  B: [['D', 'C']],
  C: [['*', 'D', 'C'], []],
  D: [['(', 'S', ')'], ['a'], ['b']],
};

export const firstFollow: Record<NonTerminal, { first: string; follow: string }> = {
  S: { first: '(, a, b', follow: '), $' },
  A: { first: '+, ε', follow: '), $' },
  B: { first: '(, a, b', follow: '+, ), $' },
  C: { first: '*, ε', follow: '+, ), $' },
  D: { first: '(, a, b', follow: '*, +, ), $' },
};

// Cada célula guarda o índice da produção em grammar.
const table: Record<NonTerminal, Partial<Record<Terminal, number>>> = {
  S: { '(': 0, a: 0, b: 0 },
  A: { '+': 0, ')': 1, $: 1 },
  B: { '(': 0, a: 0, b: 0 },
  C: { '*': 0, '+': 1, ')': 1, $: 1 },
  D: { '(': 0, a: 1, b: 2 },
};

export function formatProduction(symbols: readonly string[]): string {
  return symbols.join(' ') || 'ε';
}

export function tableCell(symbol: NonTerminal, token: Terminal): string {
  const choice = table[symbol][token];
  return choice === undefined ? '—' : formatProduction(grammar[symbol][choice]);
}

export interface Step {
  stack: string;
  input: string;
  action: string;
  lookup?: { symbol: NonTerminal; token: Terminal };
}

export interface Analysis {
  accepted: boolean;
  message: string;
  steps: Step[];
}

function isNonTerminal(symbol: string): symbol is NonTerminal {
  return nonTerminals.some(rule => rule === symbol);
}

function isTerminal(token: string): token is Terminal {
  return terminals.some(symbol => symbol === token);
}

export function analyze(sentence: string): Analysis {
  const tokens = Array.from(sentence).filter(token => !/\s/u.test(token));
  tokens.push('$');
  const stack = ['$', 'S'];
  const steps: Step[] = [];
  let cursor = 0;

  while (true) {
    const top = stack[stack.length - 1];
    const token = tokens[cursor];
    const step: Omit<Step, 'action'> = {
      stack: stack.slice().reverse().join(' '),
      input: tokens.slice(cursor).join(' '),
    };
    const reject = (message: string): Analysis => {
      steps.push({ ...step, action: message });
      return { accepted: false, message, steps };
    };

    if (!isTerminal(token) || (token === '$' && cursor !== tokens.length - 1)) {
      return reject('Símbolo inválido: ' + token);
    }

    if (top === '$' && token === '$') {
      steps.push({ ...step, action: 'Aceitar' });
      return { accepted: true, message: 'Sentença aceita', steps };
    }

    if (isNonTerminal(top)) {
      step.lookup = { symbol: top, token };
      const choice = table[top][token];
      if (choice === undefined) {
        const found = token === '$' ? 'fim da sentença' : '“' + token + '”';
        return reject('Não há regra para ' + top + ' com ' + found + '.');
      }
      const production = grammar[top][choice];
      steps.push({ ...step, action: 'Expandir ' + top + ' → ' + formatProduction(production) });
      stack.pop();
      stack.push(...[...production].reverse());
    } else {
      if (top !== token) {
        const expected = top === '$' ? 'o fim da sentença' : '“' + top + '”';
        return reject('Era esperado ' + expected + '.');
      }
      steps.push({ ...step, action: 'Ler ' + token });
      stack.pop();
      cursor++;
    }
  }
}

const closingProduction: Record<NonTerminal, number> = { S: 0, A: 1, B: 0, C: 1, D: 1 };

export function generateSentence(): string {
  function expand(symbol: string, depth: number): string {
    if (!isNonTerminal(symbol)) return symbol;
    const choices = grammar[symbol];
    const choice = depth >= 6 ? closingProduction[symbol] : Math.floor(Math.random() * choices.length);
    return choices[choice].map(token => expand(token, depth + 1)).join('');
  }
  return expand('S', 0);
}
