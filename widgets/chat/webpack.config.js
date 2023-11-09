// webpack.config.js
const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.tsx', // Your entry point
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'chat-widget.js', // The single bundled file
    library: 'ChatWidget', // The global variable when included via a script tag
    libraryTarget: 'umd', // This will output a UMD module
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript',
              ],
              plugins: ['babel-plugin-styled-components'],
            },
          },
          'ts-loader',
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    fallback: {
      'path': false,
      'os': false,
      'crypto': false,
    },
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
}
