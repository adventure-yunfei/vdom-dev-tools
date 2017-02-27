var path = require('path')
var webpack = require('webpack')
var alias = require('../alias')

var bubleOptions = {
  target: process.env.NODE_ENV === 'production' ? null : { chrome: 52 },
  objectAssign: 'Object.assign'
}

module.exports = {
  entry: {
    backend: './src/backend.js',
    hook: './src/hook.js',
    devtools: './src/devtools.js',
    background: './src/background.js',
    'devtools-background': './src/devtools-background.js'
  },
  resolve: {
    alias
  },
  output: {
    path: __dirname + '/build',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader:  'buble-loader',
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
  devtool: process.env.NODE_ENV !== 'production'
    ? '#inline-source-map'
    : false
}

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
