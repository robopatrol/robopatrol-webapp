var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({
    script: 'app.js'
  })
  .on('start', function onStart() {
    if (!called) {
      cb();
    }
    called = true;
  })
  .on('restart', function onRestart() {

    setTimeout(function reload() {
      browserSync.reload({
        stream: false
      });
    }, 500);
  });
});

// this task utilizes the browsersync plugin
// to create a dev server instance
// at http://localhost:9000
gulp.task('serve', ['build', 'nodemon'], function(done) {
  browserSync({
    proxy: 'http://localhost:9000',
    online: false,
    open: false,
    port: 7000
  }, done);
});

// this task utilizes the browsersync plugin
// to create a dev server instance
// at http://localhost:9000
gulp.task('serve-bundle', ['bundle', 'nodemon'], function(done) {
  browserSync({
    proxy: 'http://localhost:9000',
    online: false,
    open: false,
    port: 7000
  }, done);
});
