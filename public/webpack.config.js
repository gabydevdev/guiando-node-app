const Webpack = require('webpack');
const Path = require('path');
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
		}),
		new HtmlBundlerPlugin({
			entry: Path.join(__dirname, 'src/pages/'),
			preprocessor: 'handlebars',
			preprocessorOptions: {
				partials: ['src/partials/', 'src/pages/'],
			},
			js: {
				filename: 'js/[name].[contenthash:8].js',
			},
			css: {
				filename: 'css/[name].[contenthash:8].css',
			},
			verbose: true,
		}),
		// function () {
		// 	console.log('NODE_ENV: ', process.env.NODE_ENV);
		// 	console.log('isDev: ', isDev);
		// 	console.log('BASE_URL: ', process.env.BASE_URL);
		// 	console.log('API_URL: ', process.env.API_URL);
		// },
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
