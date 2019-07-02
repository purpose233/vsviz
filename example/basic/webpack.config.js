const path = require('path');

module.exports = {
  mode: 'development',

  entry: path.resolve(__dirname, './src/client.jsx'),

  devtool: 'sourcemap',

  // watch: true,

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'client.js'
  },
  
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: '/node_modules/',
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env']
          }
        }
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx']
  }
}
