const path = require('path')
const webpack = require('webpack')
const { DuplicatesPlugin } = require('inspectpack/plugin')

const EnvironmentWebpackPlugin = new webpack.EnvironmentPlugin({
  DEBUG: false,
  NODE_ENV: 'production',
  PANOPTES_ENV: 'production'
})

const plugins = [
  EnvironmentWebpackPlugin,
]

if (process.env.ANALYZE === 'true') {
  plugins.push(new DuplicatesPlugin())
}

module.exports = {
  devtool: 'source-map',
  entry: './src/components/Classifier/index.js',
  externals: [
    '@zooniverse/grommet-theme',
    '@zooniverse/panoptes-js',
    '@zooniverse/react-components',
    'grommet',
    'grommet-icons',
    'react',
    'react-dom',
    'seven-ten',
    'styled-components',
  ],
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js?$/,
        include: path.resolve(__dirname, 'src'),
        use: 'babel-loader'
      }
    ]
  },
  output: {
    path: path.resolve('dist'),
    filename: 'main.js',
    library: '@zooniverse/classifier',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  plugins,
  resolve: {
    alias: {
      inherits: path.resolve(__dirname, '../../node_modules/inherits'),
      mobx: path.resolve(__dirname, 'node_modules/mobx'),
      'mobx-state-tree': path.resolve(__dirname, 'node_modules/mobx-state-tree'),
    },
  }
}
