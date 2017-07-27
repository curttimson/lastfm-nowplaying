var gulp = require("gulp");
var sass = require('gulp-sass');
var minify = require('gulp-minify');

gulp.task('dev', ['sass-watch', 'js-watch']);

//Sass

var sassPaths = [
  './src/**/*.scss',
  './example/**/*.scss'
];

gulp.task('sass-watch', function(){
  gulp.watch(sassPaths[0], ['sass-src']);
  gulp.watch(sassPaths[1], ['sass-example']);
});

gulp.task('sass-src', function () {
  return gulp.src(sassPaths[0])
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist'));
});

gulp.task('sass-example', function () {
  return gulp.src(sassPaths[1])
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./example'));
});

//JS

gulp.task('js-watch', function(){
  gulp.watch('./src/**/*.js', ['js-src']);
});

gulp.task('js-src', function(){
  return gulp.src('./src/**/*.js')
  .pipe(minify({
      ext:{
          src:'-debug.js',
          min:'.min.js'
      }
  }))
  .pipe(gulp.dest('./dist'))
});
