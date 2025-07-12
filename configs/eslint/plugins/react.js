import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import { config as tseslintConfig } from 'typescript-eslint';

export default tseslintConfig(
  {
    name: 'whatever/react/settings',
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    name: 'whatever/react/recommended',
    files: ['**/*.{jsx,tsx}'],
    ...reactRecommended,
  },
  {
    name: 'whatever/react/common',
    files: ['**/*.{jsx,tsx}'],
    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-fragments': ['error', 'syntax'],
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'function-declaration',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react/jsx-key': ['error', { checkFragmentShorthand: true }],
      'react/jsx-boolean-value': ['error'],
      'react/destructuring-assignment': ['error', 'always'],
      'react/no-unescaped-entities': [
        'error',
        {
          forbid: [
            {
              char: '<',
              alternatives: ['&lt;'],
            },
            {
              char: '>',
              alternatives: ['&gt;'],
            },
            {
              char: '{',
              alternatives: ['&#123;'],
            },
            {
              char: '}',
              alternatives: ['&#125;'],
            },
            {
              char: '"',
              alternatives: ['&quot;'],
            },
            {
              char: "'",
              alternatives: ['&#39;'],
            },
            {
              char: '`',
              alternatives: ['&#96;'],
            },
            {
              char: ';',
              alternatives: ['&#59;'],
            },
            {
              char: '&',
              alternatives: ['&amp;'],
            },
          ],
        },
      ],
      'react/void-dom-elements-no-children': ['error'],
    },
  }
);
