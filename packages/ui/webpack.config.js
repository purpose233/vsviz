const path = require('path');

module.exports = {
  mode: 'production',

  entry: './src/worker/parse.worker.ts',

  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'parse.worker.js'
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: '/node_modules/'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
};
