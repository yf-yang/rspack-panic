import repoEslintConfig from '@whatever/eslint-config';
import { config as tseslintConfig } from 'typescript-eslint';

export default tseslintConfig(
  ...repoEslintConfig,
  {
    settings: {
      'better-tailwindcss': {
        entryPoint: 'app/app.css',
      },
    },
  },
  {
    ignores: [
      // Keep shadcn codes untouched
      'src/components/shadcn-ui/**',
      // Generated schema file should be ignored
      'src/apis/**/*.d.ts',
    ],
  },
  {
    files: ['app/**', 'src/**'],
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
              message: `Use absolute import instead
path \`@\` = \`src\`, \`@/**\` = \`src/**\` should be provided in tsconfig.json
Check https://google.github.io/styleguide/tsguide.html#import-paths`,
            },
            {
              group: ['@/lib/platePlugin/*/*'],
              message: "Directly import everything from plate plugin's index",
            },
          ],
        },
      ],
      '@typescript-eslint/no-magic-numbers': 'off',
    },
  }
);
