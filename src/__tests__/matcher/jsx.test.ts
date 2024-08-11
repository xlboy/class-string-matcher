import { classStringMatcher } from '../../matcher';
import { expect, it } from 'vitest';

const codes = [
  `"">`,
  `"text-red text-lg"`,
  `'text-blue  ...'`,
  `'a b c d ', ../...`,
  `{a: 'b c d'}`,
  `{"a b c d"}`,
  "`text-red ${true && 'text-lg'}`",
  "`text-red ${true && 'text-lg'} ${false && 'text-sm'}`",
  "{'bbb' + \"ccc\" + `ddd` + `eeee ${true && 'fff'} 那天车窗起雾`} >你好</div>",
  `(a + b + c)`,
  `(a + "text-red" + c)`,
  `(a + {b: 'text-red'} + c + 'text-lg', 'text-sm', \`haha- \${false || 'hacker'}\`)`,
  `(a + {b: 'text-red'} + ["test"])`,
];

it.each(codes)('%s', code => {
  expect(classStringMatcher(code, 'jsx')).toMatchSnapshot();
});
