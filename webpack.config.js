const HtmlWebpackPlugin = require('html-webpack-plugin');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

var path = require('path');
module.exports = {
    entry: './src/index.js',
    devServer: {
      contentBase: './dist'
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
              test: /\.css$/,
              use: [
                'style-loader',
                'css-loader'
              ]
            },
            {
              test: path.join(__dirname, 'src/es6'),
              use: 'babel-loader'
            },
            {
              test: /\.(png|svg|jpg|gif)$/,
              use: [
                'file-loader'
              ]
            }
        ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "Cucumber Dodge!",
        template: './src/index.html',
      }),
      new ServiceWorkerWebpackPlugin({
        entry: path.join(__dirname, 'src/sw.js'),
      }),
      new WebpackPwaManifest({
        'name': 'Cucumber Dodge',
        'short_name': 'Cucumber Dodge',
        'description': 'This is Cucumber Dodge!',
        'background_color': '#01579b',
        'theme_color': '#01579b',
        'theme-color': '#01579b',
        'start_url': '/cucumber-dodge/',
        'display': 'fullscreen',
        'orientation': 'portrait',
        'prefer_related_applications': false,
        'icons': [
          {
            src: path.resolve('src/assets/spritesheets/cucumber.png'),
            sizes: [96, 128, 192, 256, 384, 512],
            destination: path.join('assets', 'icons'),
          },
        ],
      }),
      ]
};
