import unicorn from 'eslint-plugin-unicorn';
import { config as tseslintConfig } from 'typescript-eslint';

export default tseslintConfig(
  unicorn.configs['flat/recommended'],
  {
    name: 'whatever/unicorn/common',
    rules: {
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-null': 'off',
      'unicorn/number-literal-case': 'off',
      'unicorn/no-useless-undefined': 'off',
      // https://github.com/prettier/eslint-config-prettier/issues/110
      'unicorn/no-nested-ternary': 'off',
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/no-negated-condition': 'off',
    },
  },
  {
    name: 'whatever/unicorn/allow-storybook-require',
    files: ['.storybook/**'],
    rules: {
      'unicorn/prefer-module': 'off',
    },
  }
);
