const Koa = require('koa');
const consola = require('consola');
const fs = require('fs');

const bodyParser = require('koa-bodyparser');
const jwtKoa = require('koa-jwt');
const logger = require('./utils/logger');
const db = require('./config/db');
const config = require('./config');
const {baseLogPath, appenders} = require('./config/log4js');

const app = new Koa();
config.dev = app.env !== 'production';

app.use(bodyParser({extendTypes: ['json', 'text', 'form']}));

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
