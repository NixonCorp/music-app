const { merge } = require("webpack-merge");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const commonConfig = require("./webpack-common");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = merge(commonConfig, {
    mode: "production",
    entry: "./src/index.tsx",
    output: {
        filename: "static/js/bundle.[contenthash].min.js",
        path: path.resolve(__dirname, "./build"),
        publicPath: "/",
    },
    devtool: "source-map",
    plugins: [new MiniCssExtractPlugin({ filename: "css/bundle.[contenthash].css" }),
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),],
});
