import betterTailwind from 'eslint-plugin-better-tailwindcss';
import { config as tseslintConfig } from 'typescript-eslint';

export default tseslintConfig({
  name: 'notebook-agent/tailwindcss/common',
  plugins: {
    'better-tailwindcss': betterTailwind,
  },
  rules: {
    ...betterTailwind.configs['recommended'].rules,
    // follow prettier-plugin-tailwindcss
    'better-tailwindcss/sort-classes': 'off',
    'better-tailwindcss/multiline': [
      'warn',
      {
        printWidth: 100,
        preferSingleLine: true,
      },
    ],
  },
});
