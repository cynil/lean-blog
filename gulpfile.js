var gulp = require('gulp')
var sync = require('browser-sync'),
    reload = sync.reload

gulp.task('serve', function(){
    sync({
        server: {
            baseDir: './app'
        }
    })

    gulp.watch(['./app/src/*.js', './app/style/*.css'], {cwd: './app'}, reload)
})