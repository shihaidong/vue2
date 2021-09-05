const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		index1: './test/index.js',
		index2: './test/index1.js',
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist')
	},
	mode: 'development',
	devtool: 'source-map',
	plugins: [
		new HtmlWebpackPlugin()
	],
	resolve: {
		alias: {
			'@' : path.resolve(__dirname, 'src')
		}
	},
	devServer:{
		port: 3000
	},
	optimization: {
		runtimeChunk: {
			name: 'single',
		},
	},
}