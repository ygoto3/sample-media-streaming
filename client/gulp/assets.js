'use strict';

const gulp = require('gulp');
const config = require('../config/build');

gulp.task('assets', () => {
  return gulp.src(config.html.src)
    .pipe( gulp.dest(config.html.dest) )
    ;
});
