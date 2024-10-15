import { classStringMatcher } from '../../matcher';
import { describe, expect, it } from 'vitest';

describe('dynamic', () => {
  const codes = [
    `"">`,
    `"'text-red' + 'text-lg'"`,
    `'"text-blue" ...'`,
    `"'a b c d '", ../...`,
    `"['1', '2', '3', \`test1 \${'test2'}\`]"`,
    `('text-red', 'text-lg')`,
    `\`text-ggg\``,
  ];

  it.each(codes)('%s', code => {
    expect(
      classStringMatcher(code, 'vue', { inDynamicContext: true }),
    ).toMatchSnapshot();
  });
});

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
