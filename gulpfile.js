/** Gulp file for tasks */

var paths = {
	scripts: 'js/source',
	js: 'js',
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
var concat = require('gulp-concat');  
var uglify = require('gulp-uglify');  

gulp.task('sass', function() {
	return gulp.src(paths.sass + '/style.scss')
		.pipe(sourcemaps.init())
		.pipe(sass(options.sass).on('error', sass.logError))
		.pipe(autoprefixer(options.autoprefixer))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.css));
});

gulp.task('scripts', function() {  
	return gulp.src(paths.scripts + '/**/*.js')
		.pipe(concat('scripts.js'))
		.pipe(uglify())
		.pipe(gulp.dest(paths.js));
});

// Watch
gulp.task('watch', function() {
     gulp.watch(paths.sass + '/**/*.scss', ['sass']); 
     gulp.watch(paths.scripts + '/**/*.js', ['scripts']); 
});

// Default
  gulp.task('default', ['sass', 'scripts']);