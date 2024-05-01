const Webpack = require('webpack');
const Path = require('path');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

require('dotenv').config({
	path: Path.resolve(__dirname, `.env.${process.env.NODE_ENV}`),
});

module.exports = {
	target: 'web',
	mode: isDev ? 'development' : 'production',
	devtool: 'source-map',
	output: {
		path: Path.resolve(__dirname, 'build/'),
	},
	resolve: {
		alias: {
			'@images': Path.join(__dirname, 'src/images'),
			'@scripts': Path.join(__dirname, 'src/scripts'),
			'@styles': Path.join(__dirname, 'src/styles'),
		},
		modules: [Path.resolve(__dirname, 'node_modules'), 'node_modules'],
	},
	plugins: [
		new Webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
			'process.env.API_URL': JSON.stringify(process.env.API_URL),
			'process.env.FORM_URL': JSON.stringify(process.env.FORM_URL),
		}),
		new CleanWebpackPlugin(),
		new HtmlBundlerPlugin({
			entry: Path.join(__dirname, 'src/pages/'),
			preprocessor: 'handlebars',
			preprocessorOptions: {
				partials: ['src/partials/', 'src/pages/'],
			},
			js: {
				filename: 'js/[name].js',
			},
			css: {
				filename: 'css/[name].css',
			},
			verbose: true,
		}),
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				include: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.s?css/i,
				use: [
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
						},
					},
					'postcss-loader',
					'sass-loader',
				],
			},
			{
				test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
				type: 'asset/resource',
			},
			{
				test: /\.svg$/,
				type: 'asset',
				loader: 'svgo-loader',
				options: {
					configFile: Path.resolve(__dirname, './svgo.config.js'),
				},
			},
		],
	},
	devServer: {
		port: 8000,
		open: false,
		static: Path.resolve(__dirname, 'build'),
		watchFiles: {
			paths: ['src/**/*.*'],
			options: {
				usePolling: true,
			},
		},
		client: {
			logging: 'error',
		},
	},
};
