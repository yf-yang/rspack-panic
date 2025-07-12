import reactHooks from 'eslint-plugin-react-hooks';
import { config as tseslintConfig } from 'typescript-eslint';

export default tseslintConfig({
  name: 'whatever/react-hooks/recommended',
  files: ['**/*.{jsx,tsx}'],
  plugins: {
    'react-hooks': reactHooks,
  },
  rules: reactHooks.configs.recommended.rules,
});
