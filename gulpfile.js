'use strict';

const gulp = require('gulp');
const pl = require('gulp-load-plugins')();
const browserSync = require('browser-sync').create();
//const moduleImporter = require('sass-module-importer');




gulp.task('browser-sync',function(){
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
});


gulp.task('without-pug', function() {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('build'))
        .on('end', browserSync.reload)
});



gulp.task('css-lib', function() { 
    return gulp.src([
        "node_modules/bootstrap/dist/css/bootstrap-theme.min.css",  
        "node_modules/bootstrap/dist/css/bootstrap.min.css",
        "node_modules/slick-carousel/slick/slick.css"]) 
    .pipe(pl.concat("lib.css"))
    .pipe(gulp.dest('src/static/css/'))
    .pipe(browserSync.reload({
        stream: true
    }));

});

gulp.task('css', function() { 
    return gulp.src(['src/static/css/*.css']) // Берем источник
    .pipe(pl.autoprefixer({browsers: 'last 2 version'}))
    .on("error", pl.notify.onError({
        message: "Error: <%= error.message %>",
        title: 'Style error'
        }))
    //.pipe(pl.csso()) 
    .pipe(gulp.dest('build/static/css/'))
    .pipe(browserSync.reload({
        stream: true
    }));

});


gulp.task('scripts-lib', function() { 
    return gulp.src([
        "node_modules/jquery/dist/jquery.min.js",  
        "node_modules/bootstrap/dist/js/bootstrap.min.js",
        "node_modules/slick-carousel/slick/slick.min.js"]) 
    .pipe(pl.concat("libs.min.js"))
    .pipe(gulp.dest('build/static/js/'))
    .pipe(browserSync.reload({
        stream: true
    }));

});

gulp.task('scripts', function() { 
    return gulp.src(['src/static/js/main.js']) 
    .pipe(gulp.dest('build/static/js/'))
    .pipe(browserSync.reload({
        stream: true
    }));

});

gulp.task('img', function() {
    return gulp.src('src/static/img/*.{png,jpg,gif}')
        .pipe(pl.imagemin([
            pl.imagemin.gifsicle({interlaced: true}),
            pl.imagemin.jpegtran({progressive: true}),
            pl.imagemin.optipng({optimizationLevel: 5}),
            pl.imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulp.dest('build/static/img'))
        .on('end', browserSync.reload)
});

gulp.task('svg', function(){
    return gulp.src('/src/static/img/svg/*.svg')
        
    .pipe(pl.svgmin({
            js2svg:{
                pretty: true
            }
        }))
        .pipe(pl.cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
            },
            parserOptions: {xmlMode: true}
        }))
        .pipe(pl.replace('&gt;', '>'))
        .pipe(pl.svgSprite({
            mode: {
                symbol:{
                    sprite: "sprite.svg"
                }
            }
        }))
        .pipe(gulp.dest('build/static/img/svg'))
});


gulp.task('watch', function(){
    gulp.watch('src/*.html', gulp.series('without-pug'));
    gulp.watch(['src/static/css/**/*.css'], gulp.series('css'));
    gulp.watch('src/static/js/main.js', gulp.series('scripts'));
    gulp.watch('src/static/img/*', gulp.series('img'));
    gulp.watch('src/static/img/svg/*.svg', gulp.series('svg'));
});

gulp.task('default', gulp.series(
    gulp.parallel('without-pug', 'css-lib', 'css', 'scripts-lib', 'scripts', /*'img', 'svg'*/),
    gulp.parallel( 'css-lib', 'css', 'scripts-lib', 'scripts', /*'img', 'svg'*/), 
    gulp.parallel('watch', 'browser-sync')
    )
);

