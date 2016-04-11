'use strict';
const gulp = require('gulp');
const pkg = require('./package.json');
const $ = require('gulp-load-plugins')();
const gulpSequence = require('gulp-sequence');
const sassdoc = require('sassdoc');
const importOnce = require('node-sass-import-once');
const filelog = require('gulp-filelog');
const sassdocOptions = {
  dest: 'docs',
  verbose: true,
  display: {
    access: ['public', 'private'],
    alias: true,
    watermark: true,
  },
  groups: {
    'undefined': 'Ungrouped'
  }
};

const sassOptions = {
  importer: importOnce,
  importOnce: {
    index: true,
    bower: true
  }
};

gulp.task('sassdoc', function() {
  return gulp.src('sass/**/*.scss')
    .pipe(sassdoc(sassdocOptions));
});

gulp.task('clean', function() {
  return gulp.src(['.tmp', 'css'], {
    read: false
  }).pipe($.clean());
});

gulp.task('sass', function() {
  return gulp.src('./sass/*.scss')
    .pipe(filelog())
    .pipe($.sass(sassOptions).on('error', $.sass.logError))
    .pipe($.size())
    .pipe(gulp.dest('./css'));
});

gulp.task('autoprefixer', function() {
  return gulp.src('css/*.css')
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe($.size())
    .pipe(gulp.dest('css'));
});

gulp.task('css', function() {
  return gulp.src('css/**/*.css')
    .pipe(filelog())
    .pipe($.sourcemaps.init())
    .pipe($.cssmin())
    .pipe($.size())
    .pipe($.concat(pkg.name + '.css'))
    .pipe($.sourcemaps.write('.'))
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('css'));
});

gulp.task('sass:watch', function() {
  gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('autoprefixer:watch', function() {
  gulp.watch('./css/**/*.css', ['autoprefixer']);
});



var cssfmt = require('gulp-cssfmt');

gulp.task('cssfmt', function() {
  return gulp.src(['css/*.css', 'css/*.min.css'])
    .pipe(filelog())
    .pipe(cssfmt())
    .pipe(gulp.dest('dist'));
});



gulp.task('watch', ['sass:watch', 'autoprefixer:watch']);
gulp.task('default', gulpSequence('clean', 'sass', 'css', 'autoprefixer', 'cssfmt', 'sassdoc'));
