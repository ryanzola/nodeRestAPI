const gulp = require('gulp')
const ts = require('gulp-typescript')
const JSON_FILES = ['./*.json', 'ts/*.json', 'ts/**/*.json']

//pull in the project typescript config
const tsProject = ts.createProject('tsconfig.json')

gulp.task('scripts', () => {
  const tsResult = tsProject.src()
  .pipe(tsProject());

  return tsResult.js.pipe(gulp.dest('build'))
});

gulp.task('watch', ['scripts'], () => {
  gulp.watch('ts/**/*.ts', ['scripts'])
})

gulp.task('assets', function() {
  return gulp.src(JSON_FILES)
  .pipe(gulp.dest('build'));
});

gulp.task('default', ['watch', 'assets']);