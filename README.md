脚手架工具
express-generator 是一个 Express 项目生成器，可以先安装该工具来生成项目结构。
下面的排版很难看，以后在排吧。
npm i -g express-generator

工具安装好之后就可以使用 express 命令来生成项目了
若要查看工具的用法，可运行 “express -h”
初始化项目
mkdir demo-ts
cd demo-ts
express --view ejs --git   # 生成 .gitignore，具体可查看 express -h

启动项目
根据 express-generator 的提示，我们依次运行以下两条命令来启动项目:

npm i
SET DEBUG=demo-ts:* & npm start

调整文件结构
由于项目的源文件需要经过转译、压缩等处理，故而建立两个文件夹，src\ 和 dist\ 分别用于存放原始文件和处理后的文件。

mkdir src dist
mv public\ routes\ views\ bin\ app.js  src\

更换模板引擎
安装 numjucks
要使用 numjucks 需要先进行安装

npm install nunjucks

导入和配置
打开 app.js 文件

添加/更新以下内容

var nunjucks = require('nunjucks');

app.set('view engine', 'html');
nunjucks.configure(path.join(__dirname, 'views'), {
  autoescape: true,
  noCache: true,
  express: app
});

更新模板文件
根据 nunjucks 的语法要求，下面会在 src/views 目录下创建一个 base.html 文件，同时更新另外两个文件（文件扩展名更改为 html）:

base.html

<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>{{title}}</title>
  {% block head %}{% endblock %}
</head>
<body>
  {% block body %}{% endblock %}
</body>
</html>

index.html

{% extends "base.html" %}

{% block head %}
<link rel='stylesheet' href='/stylesheets/style.css' />
{% endblock %}

{% block body %}
<h1>{{title}}</h1>
<p>Welcome to {{title}}</p>
{% endblock %}

error.html

{% extends "base.html" %}

{% block body %}
<h1>{{message}}</h1>
<h2>{{error.status}}</h2>
<pre>{{error.stack}}</pre>
{% endblock %}

使用 TypeScript
安装 TypeScript
使用 TypeScript 前需要先进行安装

npm i --save-dev typescript

创建 TypeScript 配置文件
TypeScript 会将 *.ts 文件转换为 *.js 文件，如何转换可以进行细粒度配置，故而要创建一个配置文件。

npx tsc --init

执行上述命令会在项目目录下生成一个 tsconfig.json 文件
安装类型支持
有一些库自身是不带 TypeScript 类型声明的，不过通常情况下可以通过 npm 安装相应的类型声明扩展包。

npm i --save-dev @types/node @types/express @types/nunjucks
npm i --save-dev @types/http-errors @types/cookie-parser @types/morgan

修改文件
将 src/bin/www 改为 src/bin/www.ts

修改 www.ts 文件:

import app from '../app';
import http from 'http';

function normalizePort(val: string): number | string | boolean {
}
function onError(error: NodeJS.ErrnoException) {
}

function onListening() {
  var addr = server.address();
  var bind = "";
  if (addr) {
    typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
  }

  debug('Listening on ' + bind);
}

将 src/routes/index.js 改为 src/routes/index.ts

修改 index.ts 文件:

import express from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', function (req: express.Request, res: express.Response, next: express.NextFunction) {
  res.render('index', { title: 'Express' });
});

export default router;

将 src/routes/users.js 改为 src/routes/users.ts

修改 users.ts 文件:

import express from 'express';

const router = express.Router();

/* GET users listing. */
router.get('/', function (req: express.Request, res: express.Response, next: express.NextFunction) {
  res.send('respond with a resource');
});

export default router;

将 src/app.js 改为 src/app.ts

修改 app.ts 文件:

import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import nunjucks from 'nunjucks';

import indexRouter from './routes/index';
import usersRouter from './routes/users';

app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {}

app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {}

export default app;

使用 Gulp
Gulp 用来执行转译任务，提高开发效率。

安装 Gulp
npm i --save-dev gulp-cli gulp gulp-typescript

配置 Gulp
Gulp 的作用是帮助开发者运行一些预定义好的任务，这些任务需要开发者自己定义。下面在项目根目录下添加一个 gulpfile.js 文件，内容如下:

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

运行 Gulp
npx gulp auto

Gulp 运行起来后，只要 src/ 目录下的文件有任何改动，就会立即更新到 dist/ 目录

使用 nodemon
nodemon 用于启动服务器应用，并且还会在程序改动后自动重启服务器。

安装 nodemon
npm i --save-dev nodemon

使用 nodemon 启动服务器
npx nodemon ./dist/bin/www.js

更新 package.json 脚本
可以更新 package.json 中的脚本，以启动 gulp 和 nodemon 任务。

{
  "scripts": {
    "watch": "gulp auto",
    "start": "nodemon ./dist/bin/www.js"
  }
}

原文链接：https://blog.csdn.net/pish7/article/details/101150617