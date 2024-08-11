export type LanguageId = 'jsx' | 'html';

export interface ClassNode {
  text: string;
  pos: { s: number; e: number };
}
