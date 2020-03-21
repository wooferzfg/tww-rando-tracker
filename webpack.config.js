const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const sass = require('sass');

module.exports = (env, argv) => {
  const basePath = __dirname;
  const isProduction = argv.mode === 'production';
  const distPath = path.join(basePath, 'dist');

  return {
    entry: {
      bundle: ['./src/index.jsx']
    },
    output: {
      filename: '[name].js',
      path: distPath
    },
    devtool: isProduction ? undefined : 'source-map',
    devServer: {
      contentBase: basePath,
      compress: true,
      port: 8080
    },
    resolve: {
      extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.json']
    },
    plugins: [
      ...(isProduction ? [new CleanWebpackPlugin()] : []),
      new HtmlWebpackPlugin({
        template: './src/index.html'
      })
    ],
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: [
            'babel-loader'
          ],
          exclude: '/node_modules'
        },
        {
          test: /\.(s*)css$/,
          use: ['style-loader', 'css-loader', {
            loader: 'sass-loader',
            options: {
              implementation: sass
            }
          }]
        }
      ]
    },
    node: {
      fs: 'empty'
    },
    mode: isProduction ? 'production' : 'development'
  };
};
