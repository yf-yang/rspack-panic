import prettierRecommended from 'eslint-plugin-prettier/recommended';
import { config as tseslintConfig } from 'typescript-eslint';

// NOTE: To use recommended rules, eslint-config-prettier is a required peer
// dependency

export default tseslintConfig(prettierRecommended);
