const path = require('path');

module.exports = {
  mode: 'development',

  // devtool: 'inline-source-map',

  entry: [
    'babel-polyfill',
    path.resolve(__dirname, './parse.worker.js')
  ],

  output: {
    path: path.resolve(__dirname, '../lib'),
    filename: 'parse.worker.js'
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: '/node_modules/',
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', {modules: 'commonjs'}]]
          }
        }
      }
    ]
  }
};
