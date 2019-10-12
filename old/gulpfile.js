var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    babel = require('gulp-babel'),
    gulpif = require('gulp-if'),
    sourcemaps = require('gulp-sourcemaps');

const arrayOfJs = ['source/GnativeSlider.js']

let isDev = false
let isProd = !isDev

/* gulp.task('js', function () {
    return gulp.src(arrayOfJs)
        .pipe(gulpif(isDev, sourcemaps.init()))
        .pipe(concat('GnativeSlider.min.js'))
        .pipe(gulpif(isProd, babel({
            presets: ['@babel/env']
        })))
        .pipe(gulpif(isProd, uglify({ toplevel: false })))
        .pipe(gulpif(isDev, sourcemaps.write('.')))
        .pipe(gulp.dest('./dist/js'))
}) */

gulp.task('cleanDist', async function () {
    const deletedPaths = await del(['dist/**', '!dist/css']);
    console.log('Deleted files and directories:\n', deletedPaths.join('\n'));
})

function devFlags(done) {
    isDev = true
    done()
}

function prodFlags(done) {
    isDev = false
    done()
}

gulp.task('dev', gulp.series(devFlags, 'js'))
gulp.task('build', gulp.series('cleanDist', prodFlags, 'js'))
