const gulp = require( 'gulp' );
const mocha = require( 'gulp-mocha' );
const istanbul = require( 'gulp-istanbul' );
const jshint = require( 'gulp-jshint' );
const jscs = require( 'gulp-jscs' );
const nodemon = require( 'gulp-nodemon' );

gulp.task( 'test', () => {
    return gulp.src( [ './app/**/*.js' ] )
        .pipe( istanbul( { includeUntested: true } ) )
        .pipe( istanbul.hookRequire() )
        .on( 'finish', () => {
            gulp.src( './specs/**/*.js' )
                .pipe( mocha() )
                .pipe( istanbul.writeReports() )
                .pipe( istanbul.enforceThresholds( { thresholds: { global: 80 } } ) )
                .once( 'error', () => {
                    process.exit( 1 );
                } )
                .once( 'end', () => {
                    process.exit();
                } );
        } );
} );

gulp.task( 'lint', () => {
    return gulp.src( [ 'app/**/*.js', 'spec/**/*.js' ] )
        .pipe( jshint() )
        .pipe( jshint.reporter( 'jshint-stylish' ) )
        .pipe( jscs( { fix: true } ) )
        .pipe( jscs.reporter() );
} );

gulp.task( 'server', () => {
    nodemon( {
        script: 'app/app.js',
        env: { 'NODE_ENV': 'development' }
    } );
} );

gulp.task( 'default', [ 'server', 'lint' ], () => {
    gulp.watch( [ 'app/**/*.js', 'spec/**/*.js' ], [ 'lint' ] );
} );
