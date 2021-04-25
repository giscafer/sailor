const {genPageSchemaJson} = require('../utils/download');
const model = require('../models/project');
const authModel = require('../models/auth');
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
        if (!ctx.params.id) {
            throw new Error('项目id为空');
        }
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
        const {id} = ctx.request.body;
        if (!id) {
            throw new Error('项目id为空');
        }
        try {
            const result = await model.Dao.update(ctx.request.body);
            ctx.body = result;
        } catch (err) {
            throw err;
        }
    },
    delete: async ctx => {
        const {id} = ctx.request.body;
        if (!id) {
            throw new Error('项目id为空');
        }
        const ids = Array.isArray(id) ? id : [id];
        try {
            const result = await model.Dao.delete(ids);
            ctx.body = result;
        } catch (err) {
            throw err;
        }
    },
    download: async ctx => {
        const {id} = ctx.request.body;
        if (!id) {
            throw new Error('项目id为空');
        }
        let project = {pages: '[]'};
        let user = {};
        try {
            // 这里不关联用户，后续可能可以下载别人分享的项目
            project = await model.Project.findOne({_id: id});
            user = await authModel.Dao.getUser(ctx.request.body.user);
        } catch (err) {
            throw err;
        }
        const pages = JSON.parse(project.pages);
        // console.log(pages);
        ctx.body = pages;
        // 生成page json 文件
        genPageSchemaJson(user?.username, project.path, pages);
    }
};
