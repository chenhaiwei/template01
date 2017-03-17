var gulp = require('gulp'),
	less = require('gulp-less'),
	clean = require('gulp-clean'),
	concat = require('gulp-concat'),
	cssmin = require('gulp-cssmin'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	path = require('path');

// 先清除老的CSS和JS压缩文件
gulp.task('cleanCss', function() {
	return gulp.src('css', {
		read: false
	}).pipe(clean());
});
gulp.task('cleanJs', function() {
	return gulp.src('js', {
		read: false
	}).pipe(clean());
});

// 编译less
gulp.task('less', ['cleanCss'], function(){
	gulp.src('less/main.less')
		.pipe(less())
		.pipe(cssmin())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('css/'))
});
// 编译js
gulp.task('js', ['cleanJs'], function(){
	gulp.src('jsdev/**/*.js')
		.pipe(gulp.dest('js/'));
});

// 监听任务
gulp.task('watch', function(){
	gulp.watch('less/*.less', ['less']);
	gulp.watch('jsdev/**/*.js', ['js']);
});
gulp.task('default', ['watch']);

// 编译任务
gulp.task('build', ['less', 'js'], function(){
	gulp.src(['jsdev/**/*.js'])
		.pipe(uglify())
		.pipe(gulp.dest('js/'));
});
