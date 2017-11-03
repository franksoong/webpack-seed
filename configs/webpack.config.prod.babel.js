/* global __dirname */
import webpack from 'webpack';
import config from './webpack.config';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import env, {getEnv, __prod__, prodPort} from './env.js';

(function(){
    console.log("Initialize env with mode: " + __prod__);
    env({
        NODE_ENV: __prod__,
        mode: __prod__,
        port: prodPort,
    });
})();

// require option for postcss-loader,
// or will cause No PostCSS Config found error
// https://www.npmjs.com/package/postcss-loader
const postCssLoaderOptions = {
    plugins: (loader) => [
        require('postcss-import')({ root: loader.resourcePath, }),
        require('postcss-cssnext')({ warnForDuplicates: false, }),
        require('autoprefixer')(),
        require('cssnano')(),
    ],
    sourceMap: false,
};


// with stripped devtool, devServer and Hot Module Replacement configurations:
export default config({
    port: getEnv("port"),
    env: getEnv("mode"),

    // http://webpack.github.io/docs/configuration.html#devtool
    // devtool: 'source-map',

    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
            noInfo: true, // set to false to see a list of every file being bundled.
        }),

        // Generate an external css file with a hash in the filename
        new ExtractTextPlugin('[name].[contenthash].css', {
            allChunks: false
        }),

        // Minify JS, https://github.com/mishoo/UglifyJS2#usage
        // http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true,
            },
            sourceMap: false,
            output: { comments: false },
        }),
    ],

    loaders: [{
        test: /(\.css|\.scss|\.sass)$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
                { loader: 'css-loader' },
                { loader: 'postcss-loader', options: postCssLoaderOptions },
                { loader: 'sass-loader' },
            ],
        }),
    }],
});