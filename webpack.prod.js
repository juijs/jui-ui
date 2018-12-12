const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = (theme) => {
    const entry = path.resolve(__dirname, 'bundles', `production.${theme}.js`);

    return {
        mode: 'production',
        entry: {
            'jui-ui': entry,
            'jui-ui.min': entry
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].js'
        },
        externals: {
            jquery: 'jQuery',
            'juijs': 'jui'
        },
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    include: /\.min\.js$/
                }),
                new ExtractTextPlugin({
                    filename: `[name].${theme}.css`
                })
            ]
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
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024 * 1024
                        }
                    }
                ]
            }]
        },
        plugins: [
            new OptimizeCssAssetsPlugin()
            // , new BundleAnalyzerPlugin()
        ]
    }
}