'use strict'

var gulp = require('gulp')
var sass = require('gulp-sass')
var webpack = require('webpack-stream')
var uncss = require('gulp-uncss')
var autoprefixer = require('gulp-autoprefixer')
var concat = require('gulp-concat')
var cssmin = require('gulp-cssmin')
var uncommentcss = require('gulp-strip-css-comments')
var imagemin = require('gulp-imagemin')
var uglify = require('gulp-uglify')
var htmlBeautify = require('gulp-html-beautify')
var pug = require('gulp-pug')
var rename = require('gulp-rename')
var gulpif = require('gulp-if')
var browserSync = require('browser-sync')
var reload = browserSync.reload
var env = require('gulp-environment')

var webpackConfig = { module: { loaders: [{ test: /(\.js|.jsx)$/, loader: 'babel', exclude: '/node_modules/', query: { presets: ['es2015'] }}]}}


gulp.task('set-production', function () {
  env.current = 'production'
})

gulp.task('set-development', function () {
  env.current = 'development'
})

gulp.task('sass', function () {
  gulp.src('src/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(uncss({ html: ['site/**/*.html', 'site/**/*.php']}))
    .pipe(autoprefixer())
    .pipe(uncommentcss())
    .pipe(env.if.production(cssmin()))
    .pipe(rename('estilos.css'))
    .pipe(gulp.dest('site/css'))
})

gulp.task('webpack', function() {
   gulp.src('src/scripts/main.js')
    .pipe(webpack(webpackConfig))
    .pipe(env.if.production(uglify()))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('src/scripts/'))
    .pipe(reload({stream:true}))
})

gulp.task('concat', function () {
  gulp.src(['src/scripts/vendor/*.js', 'src/scripts/bundle.js'])
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('site/js/'))
})

gulp.task('views', function () {
  gulp.src('src/views/*.pug')
    .pipe(pug())
    .pipe(env.if.development(htmlBeautify({indentSize: 2})))
    .pipe(gulp.dest('site'))
})

gulp.task('images', function () {
  gulp.src('src/assets/img/*')
  .pipe(imagemin())
  .pipe(gulp.dest('site/img'))
})

gulp.task('fonts', function () {
  gulp.src('src/assets/fonts/*')
    .pipe(gulp.dest('site/fonts'))
})

gulp.task('php', function () {
  gulp.src('src/assets/php/**/*.php')
    .pipe(gulp.dest('site/php'))
})

gulp.task('otros', function () {
  gulp.src('src/assets/*.*')
    .pipe(gulp.dest('site'))
})

gulp.task('assets', ['images', 'fonts', 'php', 'otros'])

gulp.task('serve', ['build'], function () {
    browserSync.init(['site/css/*.css', 'site/js/*.js', 'site/*.html'], {server: {baseDir: './site/'}})
})

gulp.task('serve:production', ['build:production'], function () {
    browserSync.init(['site/css/*.css', 'site/js/*.js', 'site/*.html'], {server: {baseDir: './site/'}})
})

gulp.task('watch', ['serve'], function () {
  gulp.watch(['src/styles/**/*.scss'], ['sass'])
  gulp.watch(['src/views/**/*.pug'], ['views'])
  gulp.watch(['src/scripts/**/*.js'], ['webpack', 'concat'])
  gulp.watch(['src/assets/**/*'], ['assets'])
})

gulp.task('watch:production', ['serve:production'], function () {
  gulp.watch(['src/styles/**/*.scss'], ['sass'])
  gulp.watch(['src/views/**/*.pug'], ['views'])
  gulp.watch(['src/scripts/**/*.js'], ['webpack', 'concat'])
  gulp.watch(['src/assets/**/*'], ['assets'])
})

gulp.task('build', ['set-development', 'views', 'sass', 'webpack', 'concat', 'assets'])
gulp.task('build:production', ['set-production', 'views', 'sass', 'webpack', 'concat', 'assets'])

gulp.task('default', ['watch:production'])
