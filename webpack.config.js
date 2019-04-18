const HtmlWebpackPlugin = require('html-webpack-plugin');

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
    devtool: 'inline-source-map',
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
        title: "Cucumber Dodge!"
      })
    ]
};
