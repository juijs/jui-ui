const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = (theme) => {
    return {
        mode: 'development',
        entry: {
            vendors: [ 'jquery', 'juijs' ],
            'jui-ui': path.resolve(__dirname, 'bundles', 'index.js')
        },
        output: {
            path: path.resolve(__dirname, 'out'),
            filename: '[name].js',
        },
        optimization: {
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    'vendors': {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        enforce: true,
                        chunks: 'all',
                        minChunks: 2
                    }
                }
            }
        },
        module: {
            rules: [{
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [ 'env' ]
                    }
                }]
            }, {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "less-loader"
                    }],
                    fallback: "style-loader"
                })
            }, {
                test: /\.(ttf|eot|svg|woff|png|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]?[hash]'
                    }
                }]
            }]
        },
        plugins: [
            new ExtractTextPlugin({
                filename: '[name].css'
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'bundles', 'index.html'),
                filename: path.resolve(__dirname, 'out', 'index.html'),
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                }
            })
        ],
        devServer: {
            port: 3000,
            inline: true,
            hot: false,
            open: true,
            contentBase: path.resolve(__dirname, 'out'),
            watchContentBase: true
        }
    }
}