import resolve      from 'rollup-plugin-node-resolve'
import commonjs     from 'rollup-plugin-commonjs'
import buble        from 'rollup-plugin-buble';

export default {
  entry : 'src/index.js',
  dest  : 'index.js',
  format: 'umd',
  moduleName  : 'PreactStateNano',
  sourceMap: false,
  external: ['preact','statenano'],
  watch : {
    chokidar: {},
    exclude: ['node_modules/**']
  },
  plugins: [ 
    resolve({
      jsnext: true,
      main: true,
    }),
    commonjs({
      include: 'node_modules/**',
    }),
    buble({
      jsx: 'h',
      objectAssign:'Object.assign'
    }),
  ]
}
