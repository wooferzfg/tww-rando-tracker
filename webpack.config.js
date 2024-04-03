const { execSync } = require('child_process');
const path = require('path');

const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const moment = require('moment');
const sass = require('sass');
const webpack = require('webpack');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = (env, argv) => {
  const basePath = __dirname;
  const isProduction = argv.mode === 'production';

  const commitHash = execSync('git rev-parse --short HEAD').toString();
  const date = moment.utc().format('YYYY-MM-DD kk:mm:ss');

  const faviconsWebpackPluginSettings = {
    logo: path.resolve('src/images/icon.png'),
    inject: true,
    manifest: './src/manifest.webmanifest',
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
      static: {
        directory: basePath,
      },
      port: 8080,
    },
    resolve: {
      extensions: ['.webpack.js', '.js', '.jsx', '.json', '.png'],
      fallback: {
        buffer: require.resolve('buffer'),
      },
    },
    output: {
      clean: true,
    },
    plugins: [
      new FaviconsWebpackPlugin(faviconsWebpackPluginSettings),
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),
      new webpack.DefinePlugin({
        BUILD_DATE: JSON.stringify(date),
        COMMIT_HASH: JSON.stringify(commitHash),
      }),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      ...(isProduction ? [new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [{
          urlPattern: /https:\/\/raw\.githubusercontent\.com/,
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
