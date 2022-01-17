const path = require('path');

module.exports = {
  entry: './src/index.jsx',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.jsx', '...'],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 9000,
  }
};