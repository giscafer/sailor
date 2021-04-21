const Koa = require('koa');
const consola = require('consola');
const fs = require('fs');

const bodyParser = require('koa-bodyparser');
const jwtKoa = require('koa-jwt');
const cors = require('koa2-cors');
const logger = require('./utils/logger');
const db = require('./config/db');
const config = require('./config');
const {baseLogPath, appenders} = require('./config/log4js');

const app = new Koa();
config.dev = app.env !== 'production';

app.use(bodyParser({extendTypes: ['json', 'text', 'form']}));

app.use(
    cors({
        origin: function (ctx) {
            //设置允许来自指定域名请求
            if (ctx.url === '/api') {
                return '*'; // 允许来自所有域名请求
            }
            return 'http://localhost:8082'; //只允许 http://localhost:8082 这个域名的请求
        },
        maxAge: 5, //指定本次预检请求的有效期，单位为秒。
        credentials: true, //是否允许发送Cookie
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
        allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
        exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
    })
);

//error
app.use(async (ctx, next) => {
    const startT = new Date();
    let ms = null;
    try {
        await next().catch(err => {
            if (err.status === 401) {
                ctx.body = {errcode: 401, errmsg: 'Authentication'};
            } else {
                throw err;
            }
        });
        ms = new Date() - startT;
    } catch (error) {
        console.log(error);
        ms = new Date() - startT;
        logger.logError(ctx, error, ms);
    }
});
// jwt
app.use(
    jwtKoa({secret: config.secret}).unless({
        path: [/^\/api\/auth\/login/, /^\/api\/auth\/logout/, /^\/api\/robot\/login/, /^((?!\/api).)*$/]
    })
);
// connect db
db.connect();

const confirmPath = function (pathStr) {
    if (!fs.existsSync(pathStr)) fs.mkdirSync(pathStr);
};

// init log
const initLogPath = function () {
    if (!baseLogPath) {
        return;
    }
    confirmPath(baseLogPath);
    for (var i = 0, len = appenders.length; i < len; i++) {
        if (appenders[i].path) {
            confirmPath(baseLogPath + appenders[i].path);
        }
    }
};

async function start() {
    const host = config.host;
    const port = config.port;

    app.use(require('./middleware/resformat')('^/api'));

    const api = require('./routes/api');
    app.use(api.routes(), api.allowedMethods());

    // app.use(ctx => {
    //     ctx.status = 200;
    //     ctx.respond = false;
    //     ctx.req.ctx = ctx;
    //     nuxt.render(ctx.req, ctx.res);
    // });

    app.listen(port, host);

    consola.ready({
        message: `Server listening on http://${host}:${port}`,
        badge: true
    });
}

start();

initLogPath();
