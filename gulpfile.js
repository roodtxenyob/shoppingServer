const { series, parallel, src, dest, watch } = require('gulp');
const ts = require("gulp-typescript");
const tsProject = ts.createProject("./tsconfig.json");

// 复制文件
exports.copyStatic = function copyStatic() {
  return src(
    [
      'src/public/**',
      'src/views/**',
    ],
    {
      base: './src',
    }
  )
    .pipe(dest('dist/'));
};

// 转译 TypeScript 到 JavaScript
exports.ts = function ts() {
  return src(
    [
      'src/**/*.ts',
    ],
    {
      base: './src',
    }
  )
    .pipe(tsProject())
    .js
    .pipe(dest('dist/'));
};

// 定义默认任务
const defaultTask = series(this.copyStatic, this.ts);
exports.default = defaultTask;

// 定义监视任务
exports.auto = function auto() {
  return watch('src/**', { ignoreInitial: false }, defaultTask);
};
