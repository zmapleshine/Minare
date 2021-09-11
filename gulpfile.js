var gulp = require('gulp');
var clean = require('gulp-clean');
var babel = require("gulp-babel");
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var connect = require('gulp-connect');

gulp.task('clean', function () {
    return gulp.src(['dist', 'index.js'], {read: false, allowEmpty: true})
        .pipe(clean());
})


gulp.task("release", function () {
    return gulp.src(["src/minare.js"])
        .pipe(babel())
        .pipe(rename({basename: 'index'}))
        .pipe(gulp.dest("./"))
});
gulp.task('compress', function () {

    return gulp.src(['index.js'])
        .pipe(uglify({
            mangle: true
        }))
        .pipe(rename({suffix: ".min", basename: "minare"}))
        .pipe(gulp.dest('dist/'));
});


gulp.task('build', gulp.series(
    'clean',
    'release',
    'compress',
));

gulp.task("run", function () {
    connect.server({
        livereload: true,
        port: 6633
    });
})

