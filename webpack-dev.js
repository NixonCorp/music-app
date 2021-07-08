const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const { merge } = require("webpack-merge");
const commonConfig = require("./webpack-common");


module.exports = merge(commonConfig, {
  mode: "development",
  entry: [
    "./src/index.tsx", // the entry point of our app
  ],
  devServer: {


    port: 3000,
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({ filename: "bundle.css" })
  ]
});
