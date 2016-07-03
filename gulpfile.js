/** Gulp file for tasks */

var paths = {
	sass: 'css/source',
	css: 'css',
};

var options = {
	sass: {
		outputStyle: 'compressed',
	},
	autoprefixer: {
		browsers: ['> 1%'],
		cascade: false,
	}
};

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function() {
	return gulp.src(paths.sass + '/style.scss')
		.pipe(sourcemaps.init())
		.pipe(sass(options.sass).on('error', sass.logError))
		.pipe(autoprefixer(options.autoprefixer))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.css));
});

// Watch
gulp.task('watch', function() {
     gulp.watch(paths.sass + '/**/*.scss', ['sass']); 
});

// Default
  gulp.task('default', ['sass']);