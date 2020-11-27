//引入模块或者文件
var Koa = require('koa'),
  logger = require('koa-logger'),
  koaBody = require('koa-body'),
  json = require('koa-json'),
  onerror = require('koa-onerror'),
  router = require('koa-router')();
const bodyparser = require('koa-bodyparser');
const path = require("path")
var cors = require('koa2-cors');
const statics = require('koa-static');

//实例化koa-------
const app = new Koa();
app.use(bodyparser())

//导入文件
var test = require("./routes/tree");

//注册路由  
router.use("/tree", test.routes(), test.allowedMethods())

// error handler
onerror(app); //异常处理

app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());

app.use(cors());
app.use(function* (next) {
  var start = new Date;
  yield next;
  var ms = new Date - start;
});
//使用koabody中间件
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 200 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
  }
}));
app.use(statics(
  path.join(__dirname, "./views/dist/")
))

// routes definition
//启动路由
app.use(router.routes()).use(router.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app;