var gulp = require("gulp");
var ghPages = require('gulp-gh-pages');

gulp.task('example-build-files', ['example-copy-npm-files', 'example-copy-lastfmnowplaying-files']);

gulp.task("example-copy-npm-files", function () {
    return gulp.src(['./node_modules/angular/angular.min.js'])
        .pipe(gulp.dest('./example/npm/'));
});

gulp.task("example-copy-lastfmnowplaying-files", function () {
    return gulp.src(['./dist/lastfm-nowplaying-debug.js',
                    './dist/lastfm-nowplaying.min.js',
                    './dist/lastfm-nowplaying.min.css'])
        .pipe(gulp.dest('./example/lastfm-nowplaying/'));
});

gulp.task('example-deploy', function() {
  return gulp.src('./example/**/*')
    .pipe(ghPages({
      "remoteUrl": "git@github.com:curttimson/lastfm-nowplaying.git"
    }));
});
