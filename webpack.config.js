const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: ['promise-polyfill/src/polyfill', 'whatwg-fetch', './src/index.ts'],
  output: {
    filename: 'script.js',
    path: path.resolve(__dirname, 'public')
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.css"
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{
          loader: MiniCssExtractPlugin.loader
        }, {
          loader: 'css-loader'
        }]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      }
    ]
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    // host: '172.20.10.3',
    port: 3000,
    open: true
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      Components: path.resolve(__dirname, 'src/components/'),
      Models: path.resolve(__dirname, 'src/models/'),
      Store: path.resolve(__dirname, 'src/store/')
    }
  }
};