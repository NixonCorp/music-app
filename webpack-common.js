const path = require("path");
const webpack = require("webpack");


const MiniCssExtractPlugin = require("mini-css-extract-plugin");



const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");



module.exports = {

    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
        new HtmlWebpackPlugin({ template: "./src/index.html",
            filename: 'index.html' }),

    ],
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
    },
    module: {
        rules: [
            {
                test: [/\.jsx?$/, /\.tsx?$/],
                use: "babel-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.svg$/,
                use: [{
                    loader: '@svgr/webpack',
                    options: {
                        svgoConfig: {
                            plugins: [{
                                prefixIds: false
                            }]
                        }
                    }
                }]
            },
            {
                test: /\.html$/,
                use: [
                    {loader: 'html-loader',
                        options: {
                            esModule: false,
                        },}
                ]
            },
            {
                test: /\.(ttf|eot|svg|png|jpg|jpeg|gif|ico)$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                    esModule: false,
                },
            },

            {
                test: /.(scss|css)$/,

                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: "css-loader",

                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: "resolve-url-loader",
                        options: {
                            sourceMap: true,
                        }
                    },
                    {
                        loader: 'postcss-loader'
                    },
                    {
                        loader: "sass-loader",

                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
        ],
    },

    optimization: {
        minimizer: [new TerserPlugin()],

        splitChunks: {
            cacheGroups: {
                vendors: {
                    priority: -10,
                    test: /[\\/]node_modules[\\/]/,
                },
            },

            chunks: "async",
            minChunks: 1,
            minSize: 30000,
            name: false,
        },
    },
};
