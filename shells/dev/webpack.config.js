var path = require('path')
var webpack = require('webpack')
var alias = require('../alias')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

var bubleOptions = {
  target: { chrome: 52 },
  objectAssign: 'Object.assign'
}

module.exports = {
  entry: {
    devtools: './src/devtools.js',
    backend: './src/backend.js',
    hook: './src/hook.js'
  },
  output: {
    path: __dirname + '/build',
    publicPath: '/build/',
    filename: '[name].js',
  },
  resolve: {
    alias
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'buble-loader',
        exclude: /node_modules/,
        options: bubleOptions
      },
      {
        test: /\.(png|woff2)$/,
        loader: 'url-loader?limit=0'
      },
      {
        test: /\.css$/,
        loader: 'style-loader?sourceMap!css-loader'
      }
    ]
  },
  performance: {
    hints: false
  },
  devtool: '#source-map',
  devServer: {
    quiet: true
  },
  plugins: [
    new FriendlyErrorsPlugin()
  ]
}
