// @ts-check
/**
 * @type {import('@swc/types').Config}
 */
const swcConfig = {
  jsc: {
    parser: {
      syntax: 'typescript',
      tsx: true,
      decorators: true,
    },
    target: 'esnext',
    baseUrl: 'src',
    paths: {
      '@': ['.'],
      '@/*': ['*'],
    },
    transform: {
      decoratorVersion: '2022-03',
    },
  },
  sourceMaps: 'inline',
};

export default swcConfig;
