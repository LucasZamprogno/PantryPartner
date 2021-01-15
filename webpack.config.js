const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: {
    main: './frontend/src/index.tsx'
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.tsx?$/,
        use: [
          'ts-loader',
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "frontend/src", "index.html")
    })
  ]
};