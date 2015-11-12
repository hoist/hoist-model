const gulp = require('gulp');
const del = require('del');

gulp.task('clean-dist',()=>{
  return del('dist');
})


gulp.task('clean-docs',()=>{
  return del('code-docs');
})
