const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
    template: path.join(__dirname, '/app/index.html'),
    filename: 'index.html',
    inject: 'body'
});

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ExtractTextPluginConfig = new ExtractTextPlugin({ // define where to save the file
    filename: '[name].bundle.css',
    allChunks: true
});

module.exports = {
    entry: [path.join(__dirname, '/app/src/index.js'), path.join(__dirname, '/app/styles/main.scss')],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            { // regular css files
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: 'css-loader?importLoaders=1'
                })
            },
            { // sass / scss loader for webpack
                test: /\.(sass|scss)$/,
                use: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
            },
            {
                test: /\.woff2?$|\.ttf$|\.eot$|\.svg$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                        outputPath: 'assets/'
                    }
                }]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    output: {
        filename: 'transformed.js',
        path: path.join(__dirname, 'build')
    },
    plugins: [
        HTMLWebpackPluginConfig,
        ExtractTextPluginConfig
    ],
    devtool: 'source-map'
};
