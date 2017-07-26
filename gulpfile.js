var gulp = require("gulp");
var sass = require('gulp-sass');

gulp.task('dev', ['sass-watch']);

var sassPaths = [
  './app/**/*.scss',
  './example/**/*.scss'
];

gulp.task('sass-app', function () {
  return gulp.src(sassPaths[0])
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app'));
});

gulp.task('sass-example', function () {
  return gulp.src(sassPaths[1])
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./example'));
});

gulp.task('sass-watch', function(){
  gulp.watch(sassPaths[0], ['sass-app']);
  gulp.watch(sassPaths[1], ['sass-example']);
});
