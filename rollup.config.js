// import typescript from 'rollup-plugin-typescript2'
import { eslint } from 'rollup-plugin-eslint';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import copy from 'rollup-plugin-copy';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import json from '@rollup/plugin-json';
import livereload from 'rollup-plugin-livereload';
import nodeResolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import typescript from 'rollup-plugin-typescript';
import url from 'rollup-plugin-url';
import visualizer from 'rollup-plugin-visualizer';

let devConfig = [];
if (!process.env.PRODUCTION) {
  devConfig = [
    serve({
      contentBase: './dist/',
      open: false
    }),
    livereload({
      watch: 'dist'
    }),
    visualizer({
      filename: 'dist/stats.html'
    })
    // eslint({
    //    exclude: [
    //       'node_modules/**',
    //       '**/**.png',
    //       '**/**.mp3'
    //    ]
    // }),
  ];
}

export default {
  input: 'src/main.ts',
  output: [
    {
      file: 'dist/bundle.js',
      format: 'iife',
      // sourcemap: 'inline'
      sourcemap: !process.env.PRODUCTION
    }
  ],
  plugins: [
    url({
      limit: 100 * 1024, // inline files < 10k, copy files > 10k
      // limit: Infinity,
      // include: ['**/*.svg'], // defaults to .svg, .png, .jpg and .gif files
      include: ['**/*.png', '**/*.mp3'],
      emitFiles: true, // defaults to true,
      fileName: 'assets/[dirname][hash][extname]'
    }),
    json(),
    typescript({
      // clean: true
    }),
    commonjs({}),
    babel({
      // exclude: 'node_modules/**'
    }),
    nodeResolve({
      jsnext: true
    }),
    htmlTemplate({
      template: 'src/index.html',
      target: 'dist/index.html'
    }),
    copy({
      targets: [
        {
          src: 'static/*',
          dest: 'dist/assets/'
        }
      ]
    }),
    terser(),
    ...devConfig
  ]
};
