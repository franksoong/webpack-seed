import path from 'path';
import chalk from 'chalk';
import shell from 'shelljs';
import webpack from 'webpack';
import config from "./webpack.config.prod.babel";
import packageJson from '../package.json';


//build
const build = (cb) => {
    webpack(config).run((error, stats) => {
        if (error) throw error;
        process.stdout.write(stats.toString({
            colors: true,
            modules: true,
            //reasons:true,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n');

        console.log(chalk.cyan('  Build complete for package ', packageJson.name, '.\n'));
        console.log(chalk.yellow('  Tip: built files are meant to be served over an HTTP server.\n'));
    });

    if (cb && typeof cb === 'function') {
        cb();
    };
};


// For CLI conveniency
console.log('building for ' + process.env.NODE_ENV + ' mode...\n');
build();



// For API
export default build;