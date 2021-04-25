const authDB = require('../models/auth');
module.exports = {
  login: async (ctx) => {
    try {
      const { username, password } = ctx.request.body;
      console.log('username=', username);
      if (!username) {
        throw new Error('账号不能为空');
      }
      if (!password) {
        throw new Error('密码不能为空');
      }
      const result = await authDB.Dao.login(ctx.request.body);
      ctx.body = result;
    } catch (err) {
      throw err;
    }
  },
  getUser: async (ctx) => {
    try {
      const result = await authDB.Dao.getUser(ctx.query.user);
      ctx.body = result;
    } catch (err) {
      throw err;
    }
  },
};
