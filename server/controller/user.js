const authDB = require('../models/auth');
module.exports = {
    login: async ctx => {
        try {
            const result = await authDB.Dao.login(ctx.request.body);
            ctx.body = result;
        } catch (err) {
            throw err;
        }
    },
    getUser: async ctx => {
        try {
            const result = await authDB.Dao.getUser(ctx.query.user);
            ctx.body = result;
        } catch (err) {
            throw err;
        }
    }
};
