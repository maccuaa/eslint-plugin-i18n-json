const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const formatter = require("@maccuaa/eslint-plugin-i18n-json/dist/formatter");

module.exports = {
  mode: "development",
  output: {
    path: `${__dirname}/dist`,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
    }),
    new ESLintPlugin({
      extensions: "js",
    }),
    new ESLintPlugin({
      extensions: "json",
      files: "./src/i18n",
      formatter,
    }),
  ],
};
