const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const path = require('path');
gulp.task('babel', () => {
  return gulp.src('lib/**/*.js', {
      base: 'lib'
    })
    .pipe(sourcemaps.init())
    .pipe(babel({
      "presets": ["es2015"]
    }))
    .pipe(sourcemaps.write('maps', {
      includeContent: false,
      sourceRoot: function (file) {
        return path.relative(path.resolve(process.cwd(), '../dist/maps'), path.dirname(file.path));
      }
    }))
    .pipe(gulp.dest('dist'));
});
