// https://eslint.org/docs/latest/rules/no-restricted-syntax

export default [
  'WithStatement',
  'BinaryExpression[operator="in"]',
  {
    selector: 'TSEnumMember BinaryExpression',
    message:
      'Enum member should not contain binary operators. Check https://github.com/typescript-eslint/typescript-eslint/issues/8001#issuecomment-1835365699 for reasons.',
  },
  {
    selector: 'TSEnumDeclaration[const=true]',
    message:
      'Const enum is banned. Check https://www.typescriptlang.org/docs/handbook/enums.html#const-enum-pitfalls. Exception: if const enum is used locally, disable this rule.',
  },
  {
    selector:
      "MemberExpression[object.object.name='process'][object.property.name='env'][property.name='NODE_ENV']",
    message:
      'Use `IS_DEV`/`IS_PROD`/`IS_TEST` instead of `process.env.NODE_ENV`.',
  },
];
