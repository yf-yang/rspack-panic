import { config as tseslintConfig, plugin, configs } from 'typescript-eslint';

import namingConventionDetail, {
  withSpecialSuffixes,
} from './ruleDetails/typescript-eslint-naming-convention.js';

export const TYPESCRIPT_ESLINT_IGNORE = [
  '**/*.{js,cjs,mjs}',
  '*.config.{js,cjs,mjs,ts}',
  '.storybook/**',
  'bin/**',
];

export default tseslintConfig(
  ...configs.strictTypeChecked,
  ...configs.stylisticTypeChecked,
  {
    name: 'whatever/@typescript-eslint/options',
    plugins: {
      '@typescript-eslint': plugin,
    },
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['src'],
        },
      },
    },
  },
  {
    name: 'whatever/@typescript-eslint/common',
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        ...namingConventionDetail,
      ],
      '@typescript-eslint/consistent-type-imports': ['error'],
      // prefix unused variables with underscore (`_`)
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/prefer-readonly': ['error'],
      '@typescript-eslint/no-confusing-void-expression': [
        'warn',
        { ignoreArrowShorthand: true },
      ],
      // Empty Interface config is allowed
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowInterfaces: 'always' },
      ],
      '@typescript-eslint/no-redundant-type-constituents': ['warn'],
      '@typescript-eslint/no-require-imports': ['error'],
      '@typescript-eslint/no-useless-empty-export': ['warn'],
      // https://google.github.io/styleguide/tsguide.html#parameter-properties
      '@typescript-eslint/parameter-properties': [
        'warn',
        { prefer: 'parameter-property' },
      ],
      '@typescript-eslint/prefer-regexp-exec': ['warn'],
      // if the promise is cached, disable this rule
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function#:~:text=are%20not%20equivalent.-,An%20async%20function%20will%20return%20a%20different%20reference%2C%20whereas%20Promise.resolve%20returns%20the%20same%20reference%20if%20the%20given%20value%20is%20a%20promise.,-It%20can%20be
      '@typescript-eslint/promise-function-async': ['error'],
      // sometimes it conflicts with eslint/no-extra-boolean-cast, disable it then. https://github.com/typescript-eslint/typescript-eslint/issues/1954#issuecomment-621988362
      '@typescript-eslint/strict-boolean-expressions': ['error'],
      // use @whatever/common assert.unreachable at default
      '@typescript-eslint/switch-exhaustiveness-check': [
        'error',
        {
          considerDefaultExhaustiveForUnions: true,
        },
      ],
      '@typescript-eslint/prefer-enum-initializers': ['error'],
      // when it comes to interface with overloading method, the only way to
      // correctly handle it is using method style signature. For such case,
      // assure the interface is not implemented with a arrow function
      // expression. for the difference among function declaration/function
      // expression/ arrow function expression, check rule `func-style`. https://github.com/typescript-eslint/typescript-eslint/discussions/6957
      '@typescript-eslint/method-signature-style': ['error'],
      // helps check type errors by writing it explicitly on your own
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowExpressions: true },
      ],
      // explicitly stating `public` helps searching through codes
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          overrides: {
            constructors: 'no-public',
          },
        },
      ],
      '@typescript-eslint/no-empty-function': [
        'error',
        {
          allow: [
            'private-constructors',
            'protected-constructors',
            'decoratedFunctions',
            'overrideMethods',
            'arrowFunctions',
          ],
        },
      ],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowNumber: true,
          allowBoolean: true,
          allowAny: true,
          allowNullish: true,
        },
      ],
      '@typescript-eslint/restrict-plus-operands': [
        'error',
        {
          skipCompoundAssignments: false,
          allowAny: true,
        },
      ],
      '@typescript-eslint/unbound-method': [
        'error',
        {
          ignoreStatic: true,
        },
      ],
      // https://github.com/goldbergyoni/nodebestpractices#-212-always-await-promises-before-returning-to-avoid-a-partial-stacktrace
      '@typescript-eslint/return-await': ['error', 'always'],
      // even empty class could be distinguished by instanceof operator, so
      // it has some use cases.
      '@typescript-eslint/no-extraneous-class': [
        'error',
        {
          allowConstructorOnly: true,
          allowEmpty: true,
          allowWithDecorator: true,
        },
      ],
      '@typescript-eslint/prefer-literal-enum-member': [
        'error',
        { allowBitwiseExpressions: true },
      ],
      // be consistent with @typescript-eslint/unbound-method
      '@typescript-eslint/no-invalid-void-type': [
        'error',
        { allowAsThisParameter: true },
      ],
      // https://github.com/microsoft/vscode-languageserver-node/issues/1207
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false,
        },
      ],
      '@typescript-eslint/no-unnecessary-condition': [
        'error',
        {
          allowConstantLoopConditions: true,
        },
      ],
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
          enforceForJSX: true,
        },
      ],
    },
  },
  {
    name: 'whatever/@typescript-eslint/tsx',
    files: ['**/*.tsx'],
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        ...withSpecialSuffixes(
          {
            selector: 'default',
            format: ['strictCamelCase', 'PascalCase'],
            leadingUnderscore: 'allow',
          },
          {
            selector: 'variable',
            modifiers: ['const'],
            format: ['strictCamelCase', 'UPPER_CASE', 'PascalCase'],
            leadingUnderscore: 'allow',
          }
        ),
        ...namingConventionDetail,
      ],
    },
  },
  {
    name: 'whatever/@typescript-eslint/test',
    files: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  {
    name: 'whatever/@typescript-eslint/magic-number',
    ignores: [
      '**/*.stories.{ts,tsx}',
      '**/tests/**',
      ...TYPESCRIPT_ESLINT_IGNORE,
    ],
    rules: {
      // for globally common used numbers, check or maintain @whatever/common
      // constants for project specific constants, create a distinct file to
      // manage them for function/class specific constants, declare it
      // independently for array indexes, prefer destructuring assignment.
      '@typescript-eslint/no-magic-numbers': [
        'error',
        {
          enforceConst: true,
          detectObjects: true,
          ignore: [0, 1, -1, 2],
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
          ignoreTypeIndexes: true,
          ignoreReadonlyClassProperties: true,
        },
      ],
    },
  },
  {
    // https://github.com/typescript-eslint/typescript-eslint/issues/8955
    name: 'whatever/@typescript-eslint/disable-typescript-syntax',
    files: ['**/*.{js,cjs,mjs}'],
    rules: {
      '@typescript-eslint/explicit-function-return-types': 'off',
      '@typescript-eslint/parameter-properties': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/typedef': 'off',
    },
  },
  {
    // NOTE: Always put this at the end of the config to override other rules
    files: TYPESCRIPT_ESLINT_IGNORE,
    ...configs.disableTypeChecked,
  }
);
