import * as tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import { config as tseslintConfig } from 'typescript-eslint';

export default tseslintConfig(
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  importPlugin.flatConfigs.react,
  {
    name: 'whatever/import/options',
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    settings: {
      'import/resolver': {
        typescript: true,
        // node: true,
      },
    },
  },
  {
    name: 'whatever/import/order',
    rules: {
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          'alphabetize': {
            order: 'asc',
          },
          'pathGroups': [
            {
              pattern: '@/**',
              group: 'parent',
            },
            {
              pattern: '@',
              group: 'parent',
            },
          ],
        },
      ],
    },
  },
  {
    name: 'whatever/import/common',
    rules: {
      // Too many false positives when using moduleResolution: bundler.
      // Didn't investigate how to make it work with eslint-import-resolver-*
      'import/no-unresolved': ['off'],
    },
  },
  {
    name: 'whatever/import/common-ts',
    files: ['**/*.{ts,tsx}'],
    rules: {
      'import/no-duplicates': ['off'],
      'import/no-anonymous-default-export': ['error'],
      'import/no-relative-packages': ['error'],
    },
  }
);
