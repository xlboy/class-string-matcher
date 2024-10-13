import moo from 'moo';

const jsValueLexerRules = {
  main: {
    start: [
      { match: '"', push: `"..."` },
      { match: "'", push: `'...'` },
      { match: '`', push: '`...`' },
      { match: '{', push: '{...}' },
      { match: '(', push: '(...)' },
    ],
  },
  [`"..."`]: {
    end: { match: /(?<!\\)"/, pop: 1 },
    content: { match: /[\s\S]/, lineBreaks: true },
  },
  [`'...'`]: {
    end: { match: /(?<!\\)'/, pop: 1 },
    content: { match: /[\s\S]/, lineBreaks: true },
  },
  ['`...`']: {
    children: { match: /\${/, push: '{...}' },
    end: { match: /(?<!\\)`/, pop: 1 },
    content: { match: /[\s\S]/, lineBreaks: true },
  },
  ['{...}']: {
    end: { match: /(?<!\\)}/, pop: 1 },
    children: [
      { match: '"', push: `"..."` },
      { match: "'", push: `'...'` },
      { match: '`', push: '`...`' },
    ],
    ignore: { match: /[\s\S]/, lineBreaks: true },
  },
  ['(...)']: {
    end: { match: /(?<!\\)\)/, pop: 1 },
    children: [
      { match: '"', push: `"..."` },
      { match: "'", push: `'...'` },
      { match: '`', push: '`...`' },
      { match: '{', push: '{...}' },
    ],
    ignore: { match: /[\s\S]/, lineBreaks: true },
  },
} satisfies { [x: string]: moo.Rules };

export const jsxLexer = moo.states(jsValueLexerRules);

export const htmlLexer = moo.states(jsValueLexerRules);

export const vuePureLexer = moo.states({
  main: {
    start: [
      { match: '"', push: `"..."` },
      { match: "'", push: `'...'` },
    ],
  },
  [`"..."`]: {
    end: { match: /(?<!\\)"/, pop: 1 },
    content: { match: /[\s\S]/, lineBreaks: true },
  },
  [`'...'`]: {
    end: { match: /(?<!\\)'/, pop: 1 },
    content: { match: /[\s\S]/, lineBreaks: true },
  },
});

export const vueDynamicLexer = moo.states(jsValueLexerRules);

export const solidLexer = moo.states(jsValueLexerRules);
