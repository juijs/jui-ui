const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = (theme) => {
    return {
        mode: 'production',
        entry: {
            'jui-ui': path.resolve(__dirname, 'bundles', `production.${theme}.js`)
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
                new UglifyJsPlugin(),
                new ExtractTextPlugin({
                    filename: `[name].${theme}.css`
                })
            ]
        },
        module: {
            rules: [{
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
            new webpack.ProvidePlugin({
            })
        ]
    }
}