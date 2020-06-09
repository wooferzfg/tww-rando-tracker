const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const sass = require('sass');

module.exports = (env, argv) => {
  const basePath = __dirname;
  const isProduction = argv.mode === 'production';

  return {
    entry: {
      bundle: ['./src/index.jsx'],
    },
    devtool: isProduction ? undefined : 'source-map',
    devServer: {
      contentBase: basePath,
      compress: true,
      port: 8080,
    },
    resolve: {
      extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.json', '.png'],
    },
    plugins: [
      ...(isProduction ? [new CleanWebpackPlugin()] : []),
      new FaviconsWebpackPlugin({
        logo: path.resolve('src/images/icon.png'),
        publicPath: '',
        inject: true,
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: [
            'babel-loader',
          ],
          exclude: '/node_modules',
        },
        {
          test: /\.(s*)css$/,
          use: ['style-loader', 'css-loader', {
            loader: 'sass-loader',
            options: {
              implementation: sass,
            },
          }],
        },
        {
          test: /\.png$/,
          use: [
            {
              loader: 'url-loader',
            },
          ],
        },
      ],
    },
    node: {
      fs: 'empty',
    },
    mode: isProduction ? 'production' : 'development',
  };
};
