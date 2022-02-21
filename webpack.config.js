const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { DefinePlugin } = require('webpack')

module.exports = {
  entry: {
    index1: './test/index.js',
    index2: './test/index1.js',
    stateTest: './test/stateTest.js',
    depTest: './test/depTest.js',
    watcherTest: './test/watcherTest.js',
    extendTest: './test/extendTest.js',
    prop: './test/props.js',
    createElementTest: './test/vdom/createElementTest.js',
    createComponentTest: './test/vdom/createComponentTest.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development',
  devtool: 'source-map',
  plugins: [new HtmlWebpackPlugin(), new DefinePlugin({ __WEEX__: true })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      shared: path.resolve(__dirname, 'src/core/util')
    }
  },
  devServer: {
    port: 4000,
    open: true
  },
  optimization: {
    runtimeChunk: {
      name: 'single'
    }
  }
}
