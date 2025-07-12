// Rules of eslint itself
import eslint from '@eslint/js';
import dedent from 'dedent';
import { config as tseslintConfig } from 'typescript-eslint';

import noRestrictedSyntaxDetail from './ruleDetails/no-restricted-syntax.js';

export default tseslintConfig(
  eslint.configs.recommended,
  {
    name: 'whatever/eslint/common',
    rules: {
      'block-scoped-var': 'error',
      'eqeqeq': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'no-restricted-properties': [
        'error',
        {
          object: 'describe',
          property: 'only',
        },
        {
          object: 'it',
          property: 'only',
        },
      ],
      // disable it for long React Functional Components
      // an acceptable possible scenario to disable it: use function scope
      // global variables, so one needs to declare functions within a
      // function (i.e. closure).
      'max-lines-per-function': [
        'error',
        { max: 150, skipComments: true, skipBlankLines: true },
      ],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-restricted-syntax': ['error', ...noRestrictedSyntaxDetail],
      'camelcase': 'off',
      'default-case': ['error'],
      // do not write one liner
      'curly': ['error', 'all'],
      // add comment `// falls through` when it is desired to fall through
      // add comment `// never falls through` would bypass this rule
      // That's useful when eslint is unable to understand a statement that
      // returns never (throws Error) would never execute.
      'no-fallthrough': [
        'error',
        { commentPattern: String.raw`never\sfalls\sthrough|falls?\s?through` },
      ],
      'no-extra-bind': ['error'],
      // use @whatever/common logging package
      'no-console': ['error'],
      'no-constant-condition': ['error', { checkLoops: false }],
      // function declaration: `function foo() {}` (allowed)
      // function expression: `const foo = function() {}` (not allowed)
      // arrow function expression: `const foo = () => {}` (allowed)
      'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
      'no-useless-computed-key': ['error'],
      'array-callback-return': ['error', { checkForEach: true }],
    },
  },
  {
    name: 'whatever/eslint/jsx',
    files: ['**/*.{jsx,tsx}'],
    rules: {
      'max-lines-per-function': ['off'],
      // allow named function as react needs its name for debugging
      // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/display-name.md
      'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
    },
  },
  {
    name: 'whatever/eslint/test',
    files: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
    rules: {
      'max-lines-per-function': 'off',
      'no-console': 'off',
    },
  },
  {
    name: 'whatever/eslint/no-restricted-imports',
    ignores: ['**/*.config.{js,ts}', '.storybook/**', '**/tests/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react',
              importNames: ['default'],
              message: 'Please use named imports instead.',
            },
          ],
          patterns: [
            {
              group: ['..', '../*'],
              message: dedent`
                Use absolute import instead
                path \`@\` = \`src\`, \`@/**\` = \`src/**\` should be provided in tsconfig.json
                Check https://google.github.io/styleguide/tsguide.html#import-paths
              `,
            },
          ],
        },
      ],
    },
  }
);
