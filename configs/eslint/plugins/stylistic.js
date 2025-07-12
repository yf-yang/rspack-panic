import stylisticJs from '@stylistic/eslint-plugin-js';
import { config as tseslintConfig } from 'typescript-eslint';

export default tseslintConfig({
  name: 'whatever/stylistic/js',
  plugins: {
    '@stylistic/js': stylisticJs,
  },
  rules: {
    // IMPORTANT: https://prettier.io/docs/en/options.html#print-width
    // Prettier’s printWidth option does not work the same way. It is not
    // the hard upper allowed line length limit. It is a way to say to
    // Prettier roughly how long you’d like lines to be. Prettier will make
    // both shorter and longer lines, but generally strive to meet the
    // specified printWidth.
    //
    // TL;DR: prettier's print width is NOT AN UPPER LIMIT!
    // Therefore, we increase eslint max-len limit to 120, but prettier's
    // print width is kept at 100. It helps improve readability while in rare
    // cases it still passes eslint check.
    '@stylistic/js/max-len': [
      'error',
      {
        code: 120,
        // exceptions:
        // - import
        // - function with no parameter
        ignorePattern: String.raw`^(?:import\W.*)|(?:function\s+[_$a-zA-Z][_$a-zA-Z0-9]*\(\))`,
        ignoreComments: true,
        ignoreUrls: true,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    // it is more conveniently handled by editors to comment/uncomment as separate lines
    // HACK: a convenient way to auto wrap multi-line comments: first write
    // JSDoc comments (starting with `/**`), then the eslint plugin will
    // provide auto wrap fix. After all comments are written, delete the
    // second asterisk (so the start becomes `/*` and the comments become
    // starred-block), then use this rule's fix to convert it to separate line
    // comments.
    '@stylistic/js/multiline-comment-style': ['error', 'separate-lines'],
    '@stylistic/js/quote-props': ['error', 'consistent-as-needed'],
    '@stylistic/js/quotes': ['warn', 'single', { avoidEscape: true }],
  },
});
