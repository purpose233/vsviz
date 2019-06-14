const path = require('path');

// TODO: add babel
module.exports = {
  mode: 'production',

  entry: path.resolve(__dirname, './parse.worker.js'),

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
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
