/** Gulp file for tasks */

var paths = {
	sass: 'css/source',
	css: 'css',
};

var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function() {
	return sass(paths.sass + '/style.scss', {
			style: 'compressed',
			sourcemap: true,
			cacheLocation: '/tmp/sass-cache'
		})
		.on('error', function (err) {
			console.error('Error!', err.message);
		})
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.css));
});

// Watch
gulp.task('watch', function() {
     gulp.watch(paths.sass + '/**/*.scss', ['sass']); 
});

// Default
  gulp.task('default', ['sass']);