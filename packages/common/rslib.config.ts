import { defineConfig } from '@rslib/core';
import { define } from '@whatever/macros';

export default defineConfig({
  source: {
    entry: {
      index: './src/index.ts',
    },
    alias: {
      '@/**': './src/**',
    },
    define,
  },
  lib: [
    {
      bundle: true,
      format: 'esm',
      dts: {
        distPath: 'dist',
        bundle: true,
      },
    },
    {
      bundle: true,
      format: 'cjs',
    },
  ],
});
