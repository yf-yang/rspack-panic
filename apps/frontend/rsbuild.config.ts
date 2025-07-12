import path from 'node:path';

import { define } from '@whatever/macros';
import { defineConfig, loadEnv } from '@rsbuild/core';
import { pluginBabel } from '@rsbuild/plugin-babel';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSourceBuild } from '@rsbuild/plugin-source-build';
import tailwindcss from '@tailwindcss/postcss';
import { pluginReactRouter } from 'rsbuild-plugin-react-router';

const { parsed } = loadEnv({
  cwd: path.resolve(import.meta.dirname, '../..'),
});

// HACK: We replace process.env.xxx with the actual value
const publicParsed = Object.fromEntries(
  Object.entries(parsed).map(([key, value]) => ['process.env.' + key, JSON.stringify(value)])
);

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginSourceBuild(),
    pluginNodePolyfill(),
    pluginReactRouter(),
    pluginBabel({
      include: /\.(?:jsx|tsx)$/,
      babelLoaderOptions(opts) {
        opts.plugins?.unshift('babel-plugin-react-compiler');
      },
    }),
  ],
  tools: {
    postcss: (_, { addPlugins }) => {
      addPlugins([tailwindcss()]);
    },
    rspack: {
      // https://github.com/web-infra-dev/rspack/issues/10833#issuecomment-3023141466
      bail: true,
    },
  },
  source: { define: { ...define, ...publicParsed } },
});
