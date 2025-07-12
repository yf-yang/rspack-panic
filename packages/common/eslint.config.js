import repoEslintConfig from '@whatever/eslint-config';
import { config as tseslintConfig } from 'typescript-eslint';

export default tseslintConfig(...repoEslintConfig);
