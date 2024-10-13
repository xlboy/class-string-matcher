import {
  htmlLexer,
  jsxLexer,
  solidLexer,
  vueDynamicLexer,
  vuePureLexer,
} from './lexer';
import moo from 'moo';

const SUPPORTED_LANGUAGE_IDS = ['jsx', 'html', 'vue', 'solid'] as const;
export type LanguageId = (typeof SUPPORTED_LANGUAGE_IDS)[number];

export interface ClassNode {
  text: string;
  pos: { s: number; e: number };
}

interface VueOptions {
  /**
   * Indicates whether the text is within a dynamic context where expressions are allowed.
   * This includes scenarios like:
   * - Vue `:class="..."`
   * - Or similar constructs in other frameworks where **dynamic values** can be used for class names.
   */
  inDynamicContext?: boolean;
}

export function classStringMatcher(
  text: string,
  languageId: 'vue',
  options: VueOptions,
): ClassNode[];
export function classStringMatcher(
  text: string,
  languageId: Exclude<LanguageId, 'vue'>,
): ClassNode[];
export function classStringMatcher(
  text: string,
  languageId: LanguageId,
  options?: VueOptions,
): ClassNode[] {
  if (!SUPPORTED_LANGUAGE_IDS.includes(languageId))
    throw new Error(`Unknown languageId: ${languageId}`);

  let lexer: moo.Lexer;
  switch (languageId) {
    case 'jsx':
      lexer = jsxLexer;
      break;
    case 'vue':
      lexer = options?.inDynamicContext ? vueDynamicLexer : vuePureLexer;
      break;
    case 'solid':
      lexer = solidLexer;
      break;
    case 'html':
    default:
      lexer = htmlLexer;
      break;
  }
  lexer.reset(text);

  const parsed = parser(lexer);
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
