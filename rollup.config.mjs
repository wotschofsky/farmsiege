// import { eslint } from 'rollup-plugin-eslint';
import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';
import livereload from 'rollup-plugin-livereload';
import resolve from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import typescript from '@rollup/plugin-typescript';
import url from '@rollup/plugin-url';
import visualizer from 'rollup-plugin-visualizer';

let devConfig = [];
if (!process.env.PRODUCTION) {
  devConfig = [
    serve({
      contentBase: './dist/',
      open: false,
      port: process.env.PORT || 3000
    }),
    livereload({
      watch: 'dist'
    }),
    visualizer({
      filename: 'dist/stats.html'
    })
    // eslint({
    //   exclude: ['node_modules/**', 'api/', '**/**.png', '**/**.mp3']
    // })
  ];
}

const sharedConfig = {
  input: 'src/main.ts',
  plugins: [
    url({
      limit: 150 * 1024, // inline files < 10k, copy files > 10k
      // limit: Infinity,
      include: ['**/*.png', '**/*.mp3'],
      emitFiles: true, // defaults to true,
      fileName: 'assets/[dirname][hash][extname]'
    }),
    json(),
    commonjs(),
    resolve(),
    copy({
      targets: [
        {
          src: 'static/*',
          dest: 'dist/'
        },
        {
          src: 'src/index.html',
          dest: 'dist/'
        }
      ]
    }),
    terser(),
    ...devConfig
  ]
};

export default [
  {
    ...sharedConfig,
    output: {
      file: 'dist/bundle.es5.js',
      format: 'iife',
      sourcemap: !process.env.PRODUCTION ? 'inline' : false
    },
    plugins: [
      ...sharedConfig.plugins,
      typescript({
        exclude: ['api/**'],
        noEmitOnError: false,
        target: 'es5'
      }),
      babel()
    ]
  },
  {
    ...sharedConfig,
    output: {
      file: 'dist/bundle.es6.js',
      format: 'es',
      sourcemap: !process.env.PRODUCTION ? 'inline' : false
    },
    plugins: [
      ...sharedConfig.plugins,
      typescript({
        exclude: ['api/**'],
        noEmitOnError: false,
        target: 'es6'
      })
    ]
  }
];
