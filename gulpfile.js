const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');

const styleFiles = ['./src/css/main.scss', './src/css/color.scss'];
const scriptFiles = ['./src/js/lib.js', './src/js/main.js'];

function styles() {
  return gulp
    .src(styleFiles)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(concat('style.css'))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 2 versions'],
        cascade: false,
      }),
    )
    .pipe(
      cleanCSS({
        level: 2,
      }),
    )
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp
    .src(scriptFiles)
    .pipe(concat('script.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream());
}

function imgCompress() {
  return gulp
    .src('./src/img/**')
    .pipe(
      imagemin({
        progressive: true,
      }),
    )
    .pipe(gulp.dest('./build/img/'));
}

function clean() {
  return del(['build/*']);
}

function watch() {
  browserSync.init({
    server: {
      baseDir: './',
    },
  });
  gulp.watch('./src/img/**', imgCompress);
  gulp.watch('./src/css/**/*.scss', styles);
  gulp.watch('./src/js/**/*.js', scripts);
  gulp.watch('./*.html').on('change', browserSync.reload);
}

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('del', clean);
gulp.task('watch', watch);
gulp.task('img-compress', imgCompress);
gulp.task(
  'build',
  gulp.series(clean, gulp.parallel(styles, scripts, imgCompress)),
);
gulp.task('dev', gulp.series('build', 'watch'));
