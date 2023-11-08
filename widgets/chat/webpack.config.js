// webpack.config.js
const path = require('path');
const dotenv = require('dotenv');
const webpack = require('webpack');

dotenv.config();

module.exports = {
  mode: 'production',
  entry: './src/index.web-component.tsx', // Your entry point
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'chat-widget.js', // The single bundled file
    library: 'ChatWidget', // The global variable when included via a script tag
    libraryTarget: 'umd', // This will output a UMD module
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      // Add rules for any other file types you might be using (CSS, etc.)
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
  ]
};
