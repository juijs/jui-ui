const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

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
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "less-loader",
                        options: {

                        }
                    }],
                    fallback: "style-loader"
                })
            }, {
                test: /\.(ttf|eot|svg|woff|png|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024 * 10
                        }
                    }
                ]
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
            }),
            new BundleAnalyzerPlugin()
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