module.exports = function () {
    return async function (ctx, next) {
        if (!global.user) throw {message: '已掉线，请重新登录'};
        await next();
    };
};
