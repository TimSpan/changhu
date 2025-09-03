// .prettierrc.js
module.exports = {
  // 箭头函数只有一个参数时省略括号 (x => x)
  arrowParens: 'avoid',

  // 多行 JSX 的 > 换到下一行
  bracketSameLine: false,

  // 对象字面量 {foo: bar} 是否加空格
  bracketSpacing: false,

  // 使用单引号
  singleQuote: true,

  // 多行时尽量在末尾加逗号
  trailingComma: 'all',

  // 一行最大长度调大，避免 import / if / 函数调用换行
  printWidth: 200,

  // Markdown 文本不自动换行
  proseWrap: 'never',

  // JSX 内部使用单引号
  jsxSingleQuote: true,
};
