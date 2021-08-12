const path = require('path');

const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const sass = require('sass');
const webpack = require('webpack');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = (env, argv) => {
  const basePath = __dirname;
  const isProduction = argv.mode === 'production';

  const faviconsWebpackPluginSettings = {
    logo: path.resolve('src/images/icon.png'),
    inject: true,
  };

  if (isProduction) {
    faviconsWebpackPluginSettings.prefix = '.';
    faviconsWebpackPluginSettings.publicPath = '.';
  }

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
      extensions: ['.webpack.js', '.js', '.jsx', '.json', '.png'],
    },
    output: {
      clean: true,
    },
    plugins: [
      new FaviconsWebpackPlugin(faviconsWebpackPluginSettings),
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      ...(isProduction ? [new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [{
          urlPattern: new RegExp('https://raw.githubusercontent.com'),
          handler: 'StaleWhileRevalidate',
        }],
      })] : []),
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
          type: 'asset/inline',
        },
      ],
    },
    mode: isProduction ? 'production' : 'development',
  };
};
