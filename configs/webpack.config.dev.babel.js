import config from './webpack.config';
import webpack from 'webpack';
import path from 'path';
import env, {getEnv, __dev__, devPort} from './env.js';

(function(){
    console.log("Initialize env with mode: " + __dev__);
    env({
        NODE_ENV: __dev__,
        mode: __dev__,
        port: devPort,
    });
})();

// require option for postcss-loader,
// or will cause No PostCSS Config found error
// https://www.npmjs.com/package/postcss-loader
const postCssLoaderOptions = {
    plugins: (loader) => [
        require('postcss-import')({ root: loader.resourcePath, }),
        require('postcss-cssnext')({ warnForDuplicates: false, }),
    ],
    sourceMap: true,
};

export default config({
    port: getEnv("port"),
    env: getEnv("mode"),

    // http://webpack.github.io/docs/configuration.html#devtool
    devtool: 'eval',

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],

    loaders: [{
            test: /(\.css|\.scss|\.sass)$/,
            exclude: /node_modules/,
            use: [
                { loader: 'style-loader' },
                { loader: 'css-loader?sourceMap' },
                { loader: 'postcss-loader', options: postCssLoaderOptions },
                { loader: 'sass-loader?sourceMap' },
            ]
        }
    ],
});