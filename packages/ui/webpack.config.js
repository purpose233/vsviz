const path = require('path');

module.exports = {
  mode: 'production',

  // devtool: 'inline-source-map',

  watch: true,

  entry: [
    'babel-polyfill',
    path.resolve(__dirname, './src/index.ts')
  ],

  output: {
    path: path.resolve(__dirname, './lib'),
    filename: 'index.js',
    libraryTarget: 'commonjs'
  },

  module: {
    rules: [
      {
        test: /\.worker\.js$/, //以.worker.js结尾的文件将被worker-loader加载
        use: { 
          loader: 'worker-loader',
          options: { inline: true } 
        }
      },
      {
        test: /\.tsx?$/,
        exclude: '/node_modules/',
        use: 'ts-loader'
      }
      // {
      //   test: /\.jsx?$/,
      //   exclude: '/node_modules/',
      //   use: {
      //     loader: 'babel-loader',
      //     options: {
      //       presets: ['@babel/preset-react', '@babel/preset-env']
      //     }
      //   }
      // }
    ]
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx']
  }
};
