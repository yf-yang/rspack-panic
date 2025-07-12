import storybook from 'eslint-plugin-storybook';
import { config as tseslintConfig } from 'typescript-eslint';

export default tseslintConfig(...storybook.configs['flat/recommended']);
