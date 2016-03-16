var gulp = require('gulp');
var runSequence = require('run-sequence');

require('require-dir')('./tasks');
gulp.task('default', ['build', 'test']);
gulp.task('build', ['babel']);
gulp.task('clean', ['clean-dist', 'clean-docs']);
