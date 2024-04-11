const Path = require("path");
const Webpack = require("webpack");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const common = require("./webpack.common.js");

module.exports = merge(common, {
	mode: "production",
	devtool: "source-map",
	output: {
		path: Path.join(__dirname, "../build"),
		filename: "js/[name].[contenthash].js",
		chunkFilename: "js/[name].[contenthash].chunk.js",
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "css/[name].[contenthash].css",
			chunkFilename: "css/[name].[contenthash].chunk.css",
		}),
	],
	module: {
		rules: [
			{
				test: /\.s?css$/,
				use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
			},
		],
	},
});
