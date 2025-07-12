import jestPlugin from 'eslint-plugin-jest';
import { config as tseslintConfig } from 'typescript-eslint';

export default tseslintConfig({
  ...jestPlugin.configs['flat/recommended'],
  name: 'whatever/jest',
  files: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
});
