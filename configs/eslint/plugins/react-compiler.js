import reactCompiler from 'eslint-plugin-react-compiler';
import { config as tseslintConfig } from 'typescript-eslint';

export default tseslintConfig({
  name: 'whatever/react-compiler/recommended',
  plugins: {
    'react-compiler': reactCompiler,
  },
  rules: {
    'react-compiler/react-compiler': 'error',
  },
});
