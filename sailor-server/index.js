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
            if (ctx.url === '/test') {
                return false;
            }
            return ctx.header.origin; // 允许所有跨域
        },
        maxAge: 5,
        credentials: true,
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
        exposeHeaders: ['WWW-Authenticate', 'Server-Authorization', 'Content-Disposition']
    })
);

//error
app.use(async (ctx, next) => {
    const startT = new Date();
    let ms = null;
    try {
        await next().catch(err => {
            if (err.status === 401) {
                ctx.body = {status: 401, msg: '请登录！'};
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
        path: [
            /^\/sailor\/api\/auth\/login/,
            /^\/sailor\/api\/auth\/logout/,
            /^\/sailor\/api\/project\/file/,
            /^((?!\/sailor\/api).)*$/
        ]
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

    app.use(require('./middleware/resformat')('^/sailor/api'));

    const api = require('./routes/api');
    app.use(api.routes(), api.allowedMethods());

    app.listen(port, host);

    consola.ready({
        message: `Server listening on http://${host}:${port}`,
        badge: true
    });
}

start();

initLogPath();
