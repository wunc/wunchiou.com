/** Gulp file for tasks */

var paths = {
	sass: 'css/source',
	css: 'css',
};

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function() {
	return gulp.src(paths.sass + '/style.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({
				outputStyle: 'compressed',
			})
			.on('error', function (err) {
				console.error('Error!', err.message);
			})
		)
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.css));
});

// Watch
gulp.task('watch', function() {
     gulp.watch(paths.sass + '/**/*.scss', ['sass']); 
});

// Default
  gulp.task('default', ['sass']);