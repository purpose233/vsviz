const path = require('path');

module.exports = {
  mode: 'development',

  entry: path.resolve(__dirname, './src/client.tsx'),

  // devtool: 'sourcemap',

  watch: true,

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'client.js'
  },
  
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: '/node_modules/',
        use: 'ts-loader'
      },
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
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  }
}
