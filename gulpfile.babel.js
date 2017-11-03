import del from "del";
import path from "path";
import gulp from "gulp";
import open from "open";
import gulpLoadPlugins from "gulp-load-plugins";
import runSequence from "run-sequence";
import shell from 'shelljs';


const $ = gulpLoadPlugins({ camelize: true });

//dist output dir
const outdir = path.join(__dirname, 'out');
let prodPort;

// Main tasks
gulp.task('dev', () => runSequence('dev:config', 'webpack:dev'));
gulp.task('dist', () => runSequence('dist:config', 'dist:clean', 'copy:assets', 'copy:manifest', 'webpack:prod', 'dist:serve'));
gulp.task('clean', ['dist:clean']);


// For dev
gulp.task('dev:config', () => {
    process.env.NODE_ENV = 'development';
    process.env.PORT = 3000;
});


//// Start a livereloading development server
gulp.task('webpack:dev', (cb) => {
    // --progress
    let cmd = "webpack-dev-server --config ./configs/webpack.config.dev.babel.js";
    if (shell.exec(cmd).code !== 0) {
        shell.echo('webpack-dev-server start failed!');
        shell.exit(1);
    };
});


// For dist
gulp.task('dist:config', () => {
    process.env.NODE_ENV = 'production';
    process.env.PORT = 8080;
    prodPort = process.env.PORT;
});

gulp.task('dist:clean', cb => {
    //or del([outdir], { dot: true }, cb)

    let assetsPath = path.join(outdir);
    shell.rm('-rf', assetsPath);
    shell.mkdir('-p', assetsPath);

    cb();
});

gulp.task('copy:assets', () => {
    let cssdir = path.join(outdir, 'css');
    let fontsdir = path.join(outdir, 'fonts');
    let imagesdir = path.join(outdir, 'images');
    let datadir = path.join(outdir, 'data');

    gulp.src([
            'src/assets/**/*.css'
        ])
        .pipe($.changed(cssdir))
        .pipe(gulp.dest(cssdir))
        .pipe($.size({ title: 'copy css' }))

    gulp.src([
            'src/assets/fonts/**'
        ])
        .pipe($.changed(fontsdir))
        .pipe(gulp.dest(fontsdir))
        .pipe($.size({ title: 'copy fonts' }))

    gulp.src([
            'src/assets/images/**'
        ])
        .pipe($.changed(imagesdir))
        .pipe(gulp.dest(imagesdir))
        .pipe($.size({ title: 'copy images' }))

    gulp.src([
            'src/data/**'
        ])
        .pipe($.changed(datadir))
        .pipe(gulp.dest(datadir))
        .pipe($.size({ title: 'copy data files' }))
});


gulp.task('copy:manifest', () => {
    gulp.src([
            'src/manifest.json'
        ])
        .pipe($.changed(outdir))
        .pipe(gulp.dest(outdir))
        .pipe($.size({ title: 'manifest.json' }))
});


gulp.task('dist:serve', (cb) => {
    let cmd = "babel-node ./configs/prodServer.js";
    if (shell.exec(cmd).code !== 0) {
        shell.echo('prodServer failed!');
        shell.exit(1);
    };

    cb();
});

//// Create a distributable package
gulp.task('webpack:prod', (cb) => {
    let cmd = "babel-node ./configs/prodBuild.js";
    if (shell.exec(cmd).code !== 0) {
        shell.echo('prodBuild failed!');
        shell.exit(1);
    };

    cb();
});