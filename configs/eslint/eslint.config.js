import { config as tseslintConfig } from 'typescript-eslint';

import pluginCommentLength from './plugins/comment-length.js';
import pluginComments from './plugins/comments.js';
import eslintJs from './plugins/eslintJs.js';
import pluginImport from './plugins/import.js';
import pluginJest from './plugins/jest.js';
import pluginPrettier from './plugins/prettier.js';
import pluginReactCompiler from './plugins/react-compiler.js';
import pluginReactHooks from './plugins/react-hooks.js';
import pluginReact from './plugins/react.js';
import pluginStorybook from './plugins/storybook.js';
import pluginStylistic from './plugins/stylistic.js';
import pluginTailwind from './plugins/tailwind.js';
import pluginTypescriptEslint from './plugins/typescript-eslint.js';
import pluginUnicorn from './plugins/unicorn.js';

export default tseslintConfig(
  {
    name: 'whatever/ignores',
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/fixtures/**',
      '**/coverage/**',
      '**/__snapshots__/**',
      '**/build/**',
      '**/.whatever/**',
      '**/.react-router/**',
    ],
  },
  // always put prettier at the beginning
  ...pluginPrettier,
  ...eslintJs,
  ...pluginStylistic,
  ...pluginTypescriptEslint,
  ...pluginImport,
  ...pluginComments,
  ...pluginCommentLength,
  ...pluginTailwind,
  ...pluginReactHooks,
  ...pluginReact,
  ...pluginReactCompiler,
  ...pluginStorybook,
  ...pluginUnicorn,
  ...pluginJest
);
