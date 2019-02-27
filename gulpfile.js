// npm packages
const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const connect = require('gulp-connect');

/********* JavaScript files ****************************/
/* Concatenate separate JavaScript files, minify the output*/
gulp.task("scripts", function() {
  return gulp.src(['js/circle/autogrow.js',
  'js/circle/circle.js',
  'js/global.js'])
  .pipe(sourcemaps.init())
  .pipe(concat("all.js"))
  .pipe(uglify())
  .pipe(rename("all.min.js"))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest("dist/scripts"));
});

/*****************Local web server****************/
// This task serves the project using a local webserver */
gulp.task("connect", function() {
  connect.server({
    port:3000,
    root: './',
    livereload: true
  });
});

/********* Sass files ****************************/
/* Turn "global.scss" into CSS file, minify it */
gulp.task("styles", function() {
  return gulp.src("sass/global.scss")
  .pipe(sourcemaps.init({largeFile: true}))
  .pipe(sass())
  .pipe(cleanCSS())
  .pipe(rename("all.min.css"))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest("dist/styles"))
  .pipe(connect.reload());
});

/********* Images ****************************/
/* Optimize images */
gulp.task("images", function() {
   return gulp.src("images/*")
  .pipe(imagemin([
            // Compress .jpg files
            imageminMozjpeg({
                quality: 50
            }),
            // Compress .png files
            imageminPngquant(
                [0.7 , 0.7]
            )
        ]))
  .pipe(gulp.dest("dist/content"));
});

/**************** Clean ***********************/
// Cleaning "dist" directory
gulp.task("clean", function() {
   return del('dist');
});

/******************Build**************************/
// This task runs other tasks in certain order */
gulp.task("build", gulp.series("clean", "scripts", "styles", "images"));


/**********Watch**************************/
gulp.task("watch", function() {
  gulp.watch("sass/*.scss", gulp.series("styles"));
});

/******************Default**************************/
// This task runs by default */
gulp.task("default", gulp.series("build", gulp.parallel("watch", "connect")));
