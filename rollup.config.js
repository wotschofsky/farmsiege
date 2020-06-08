// import { eslint } from 'rollup-plugin-eslint';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';
import livereload from 'rollup-plugin-livereload';
import obfuscatorPlugin from 'rollup-plugin-javascript-obfuscator';
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

const allowedDomains = ['.felisk.io', '.feliskio.now.sh'];
if (!process.env.PRODUCTION) {
  allowedDomains.push('localhost');
}

const sharedConfig = {
  input: 'src/main.ts',
  plugins: [
    url({
      limit: 100 * 1024, // inline files < 10k, copy files > 10k
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
          dest: 'dist/assets/'
        },
        {
          src: 'src/index.html',
          dest: 'dist/'
        }
      ]
    }),
    terser(),
    obfuscatorPlugin({
      sourceMap: !process.env.PRODUCTION,
      compact: true,
      selfDefending: true,
      domainLock: allowedDomains
    }),
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
