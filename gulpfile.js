/* 
Here's a quick rundown of our Gulp setup:

------------------
TERMINAL COMMANDS:
------------------
gulp       - This will run the build process once then stop
gulp watch - This will run the build process, then will start watching asset files for changes. 
			 When a file is changed the associated build task will run again and livereload will fire.


---------------------
ASSET FILE STRUCTURE:
---------------------
THEME/assets/styles/styles.scss   ->   THEME/dist/styles/styles.min.css
THEME/assets/scripts/scripts.js   ->   THEME/dist/scripts/scripts.min.js

We enqueue the processed files from dist/


-------------------------------------------------
Running Gulp will do the following things for us:
-------------------------------------------------
SCSS
	- Autoprefix our SCSS
	- Minify the output CSS
	- Add '.min' to the end of the output file name
	- Drop the final autoprefixed, minified CSS file in dist/styles as style.css

JS
	- Concatenate all our JS files
	- add '.min' to the end of the output file name
	- Minify the JS
	- Runs jshint on our JS, catching common errors and warnings and displaying them in the terminal
	- Drops the final JS file in the dist/scripts folder

IMAGES
	- Compress images from assets/images
	- Drop compressed images in dist/images
*/



// Load dependancies
var gulp         = require('gulp'),
	phplint      = require('phplint').lint,
    sass         = require('gulp-sass'),
    sassGlob     = require('gulp-sass-glob-import');
    autoprefixer = require('gulp-autoprefixer'),
	cleanCSS     = require('gulp-clean-css'),
	sourcemaps   = require('gulp-sourcemaps'),
    jshint       = require('gulp-jshint'),
    uglify       = require('gulp-uglify'),
    imagemin     = require('gulp-imagemin'),
    rename       = require('gulp-rename'),
    concat       = require('gulp-concat'),
    cache        = require('gulp-cache'),
    livereload   = require('gulp-livereload'),
    notify       = require('gulp-notify'),
	del          = require('del'),
	phpcs        = require('gulp-phpcs');



// Process SCSS
gulp.task('sass', function() {
	return gulp.src( 'assets/styles/styles.scss' )
		.pipe(sassGlob()) // allow importing multiple files using '/*'
		.pipe(sass({ sourcemap: true, style: 'compressed'}))
		.pipe(autoprefixer('last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(cleanCSS({ compatibility: '*' }))
		.pipe(sourcemaps.write())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('dist/styles'))
		.pipe(notify({ message: 'Sass completed' }))
})

// Process JS
gulp.task('scripts', function() {
	return gulp.src( 'assets/scripts/**/*.js' )
		.pipe(concat('scripts.js'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(jshint())
		.pipe(gulp.dest('dist/scripts'))
		.pipe(notify({ message: 'Scripts completed' }))
})

// Process Images
gulp.task('images', function() {
	return gulp.src('assets/images/**/*')
		.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
		.pipe(gulp.dest('dist/images'))
		.pipe(notify({ message: 'Image compression completed' }));
});

// Lint for PHP errors
gulp.task('phplint', function (cb) {
	phplint(['./*.php', './*/*.php', './*/*/*.php', '!./node_modules/**/*.php'], {limit: 10}, function (err, stdout, stderr) {
		if (err) {
			cb(err)
			process.exit(1)
		}
		cb()
	});
});

// Lints for WP STANDARDS, prints to terminal
gulp.task('phpcs', function() {
	return gulp.src(['./**/*.php', '!./node_modules/**/*.php'])
		.pipe(phpcs({
			bin: '/usr/local/bin/phpcs',
			standard: 'WordPress-Extra',
			showSniffCode: true,
		}))
		.pipe(phpcs.reporter('log'));
});

// Set default task order
gulp.task('default', function() {
	gulp.start( 'sass', 'scripts', 'images', 'phplint' );
});

// Watch for changing files
gulp.task('watch', function() {
	// Watch SCSS files
	gulp.watch('assets/styles/**/*.scss', ['sass']);
	// Watch JS files
	gulp.watch('assets/scripts/**/*.js', ['scripts']);
	// Watch Images
	gulp.watch('assets/images/**/*', ['images']);
	// Watch Theme PHP
	gulp.watch('./**/*.php', ['phplint']);
	// Create LiveReload server
	livereload.listen();
	// Watch any files in dist/, reload on change
	gulp.watch(['dist/**']).on('change', livereload.changed);
});
