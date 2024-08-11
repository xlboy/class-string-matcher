import moo from 'moo';

export const jsxLexer = moo.states({
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
});
