import { jsxLexer } from './lexer';
import type { ClassNode, LanguageId } from './types';
import moo from 'moo';

const lexers = {
  jsx: jsxLexer,
} satisfies Record<LanguageId, moo.Lexer>;

export function classStringMatcher(
  text: string,
  languageId: LanguageId,
): ClassNode[] {
  if (!(languageId in lexers))
    throw new Error(`Unknown languageId: ${languageId}`);

  const lexer = lexers[languageId];
  lexer.reset(text);

  const parsed = parser(jsxLexer);
  const classNodes: ClassNode[] = parsed.map(v => {
    if (v.isEmpty) {
      return {
        text: '',
        pos: { s: v.tokens[1].offset, e: v.tokens[1].offset },
      };
    }
    return {
      text: v.tokens.map(t => t.text).join(''),
      pos: { s: v.tokens[0].offset, e: v.tokens.at(-1)!.offset },
    };
  });

  return classNodes;
}

function parser(lexer: moo.Lexer) {
  const classlist: Array<{ tokens: moo.Token[]; isEmpty: boolean }> = [];
  let currentParts: moo.Token[] = [];

  // 加 try 是为了让后面无效 token 不会报错（但前面的有效 token 会被保留）
  try {
    let t: moo.Token;
    let lastT: moo.Token | undefined;
    while ((t = lexer.next()!)) {
      switch (t.type) {
        case 'ignore':
        case 'start':
          break;

        case 'children':
        case 'end': {
          if (currentParts.length > 0) {
            classlist.push({ tokens: currentParts, isEmpty: false });
          } else if (lastT?.text === t.text) {
            classlist.push({ tokens: [lastT, t], isEmpty: true });
          }
          currentParts = [];
          break;
        }

        case 'content': {
          currentParts.push(t);
          break;
        }

        default:
          throw new Error(`Unexpected token: ${t.type}`);
      }
      lastT = t;
    }
  } catch (_) {}

  return classlist;
}
