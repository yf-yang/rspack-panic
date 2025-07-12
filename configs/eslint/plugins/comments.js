import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import { config as tseslintConfig } from 'typescript-eslint';

export default tseslintConfig(comments.recommended, {
  name: 'whatever/eslint-comments/common',
  rules: {
    // please write meaningful sentences
    '@eslint-community/eslint-comments/require-description': [
      'error',
      { ignore: ['eslint-enable'] },
    ],
    '@eslint-community/eslint-comments/disable-enable-pair': [
      'error',
      { allowWholeFile: true },
    ],
  },
});
