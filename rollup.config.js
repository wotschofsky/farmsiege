// import typescript from 'rollup-plugin-typescript2'
import typescript from 'rollup-plugin-typescript';
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import htmlTemplate from 'rollup-plugin-generate-html-template'
import babel from 'rollup-plugin-babel'
import url from 'rollup-plugin-url'
import nodeResolve from 'rollup-plugin-node-resolve'
import visualizer from 'rollup-plugin-visualizer'
import { terser } from 'rollup-plugin-terser'
import { eslint } from 'rollup-plugin-eslint'
import commonjs from 'rollup-plugin-commonjs'//#


let devConfig = []
if(!process.env.PRODUCTION) {
   devConfig = [
      serve({
         contentBase: './dist/',
         open: true
      }),
      livereload({
         watch: 'dist',
      }),
      visualizer({
         filename: 'dist/stats.html'
      }),
      eslint({
         exclude: [
            'node_modules/**',
            '**/**.png'
         ]
      }),
   ]
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
         fileName: '[dirname][hash][extname]',
      }),
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
         target: 'dist/index.html',
      }),
      terser(),
      ...devConfig
   ]
}
