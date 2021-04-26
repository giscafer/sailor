/*
 * @Desc: 格式化响应数据
 */
const resFormat = function (pattern) {
  return async (ctx, next) => {
    const reg = new RegExp(pattern);
    try {
      await next();
    } catch (error) {
      ctx.status = 200;
      ctx.body = {
        status: error.code ? error.code : 1,
        msg: error.message || '操作失败',
      };
      throw error;
    }
    if (reg.test(ctx.originalUrl)) {
      if (ctx.body && ctx.body.original) return (ctx.body = ctx.body.body);
      if (new RegExp('^/sailor/api/project/exportZip').test(ctx.originalUrl)) {
        // 放过文件下载拦截（坑了好久）
        // console.log(ctx.originalUrl, 1, ctx.body, ctx.params.path);
      } else {
        ctx.body = {
          status: 0,
          msg: '操作成功',
          data: ctx.body,
        };
      }
    }
  };
};

module.exports = resFormat;
