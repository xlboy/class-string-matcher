import { classStringMatcher } from '../../matcher';
import { describe, expect, it } from 'vitest';

// describe('dynamic', () => {
//   console.log('please see jsx.test.ts');
// });

describe('pure', () => {
  const codes = [
    `"">`,
    `"text-red text-lg"`,
    `'text-blue  ...'`,
    `'a b c d ', ../...`,
  ];

  it.each(codes)('%s', code => {
    expect(
      classStringMatcher(code, 'vue', { inDynamicContext: false }),
    ).toMatchSnapshot();
  });
});
