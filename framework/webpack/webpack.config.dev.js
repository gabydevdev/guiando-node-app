const Path = require("path");
const Webpack = require("webpack");
const { merge } = require("webpack-merge");
const ESLintPlugin = require("eslint-webpack-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");

const common = require("./webpack.common.js");

module.exports = merge(common, {
	mode: "development",
	devtool: "eval-cheap-source-map",
	devServer: {
		static: {
			directory: Path.join(__dirname, "../build"),
		},
		hot: true,
	},
	plugins: [
		new Webpack.HotModuleReplacementPlugin(),
		new ESLintPlugin({
			extensions: ["js"],
			exclude: "node_modules",
			context: Path.resolve(__dirname, "../src"), // Specify the directory to lint
			eslintPath: require.resolve("eslint"),
			overrideConfigFile: Path.resolve(__dirname, "../.eslintrc"), // Path to your ESLint configuration
		}),
		new StylelintPlugin({
			files: "src/**/*.scss",
			configFile: Path.resolve(__dirname, "../.stylelintrc.json"), // Path to your Stylelint configuration
		}),
	],
	module: {
		rules: [
			{
				test: /\.s?css$/,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							sourceMap: true,
						},
					},
					{
						loader: "sass-loader",
						options: {
							sourceMap: true,
						},
					}
				],
			},
		],
	},
});
