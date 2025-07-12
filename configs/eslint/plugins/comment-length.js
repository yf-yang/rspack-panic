import { configs } from 'eslint-plugin-comment-length';
import { config as tseslintConfig } from 'typescript-eslint';

export default tseslintConfig(configs['flat/recommended'], {
  name: 'whatever/comment-length/common',
  rules: {
    'comment-length/limit-single-line-comments': [
      'warn',
      {
        // when codes are commented out and 3 characters are added, we don't
        // want the plugin to complain
        maxLength: 103,
        ignoreUrls: true,
        ignoreCommentsWithCode: true,
        mode: 'compact-on-overflow',
      },
    ],
    'comment-length/limit-multi-line-comments': 'off',
  },
});
