const model = require('../models/project');
module.exports = {
    getList: async ctx => {
        try {
            const result = await model.Dao.list(ctx.query.user);
            ctx.body = result;
        } catch (err) {
            throw err;
        }
    },
    getProject: async ctx => {
        try {
            const result = await model.Dao.getProject({userId: ctx.query.user, id: ctx.params.id});
            ctx.body = result;
        } catch (err) {
            throw err;
        }
    },
    add: async ctx => {
        try {
            const result = await model.Dao.add(ctx.request.body);
            ctx.body = result;
        } catch (err) {
            throw err;
        }
    },
    update: async ctx => {
        try {
            const result = await model.Dao.update(ctx.request.body);
            ctx.body = result;
        } catch (err) {
            throw err;
        }
    },
    delete: async ctx => {
        const ids = Array.isArray(ctx.request.body.id) ? ctx.request.body.id : [ctx.request.body.id];
        try {
            const result = await model.Dao.delete(ids);
            ctx.body = result;
        } catch (err) {
            throw err;
        }
    }
};
