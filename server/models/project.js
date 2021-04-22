const moment = require('moment');
const {mongoose} = require('../config/db');
const {Auth} = require('./auth');
const Schema = mongoose.Schema;
const schema = new Schema({
    id: String, // 项目id
    coverImg: String,
    name: String,
    path: String, // 项目标识
    pages: String, // 项目内容 json string
    creator: String, // 创建人，name
    userId: String, // userId
    updateTime: {type: String, default: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')},
    createTime: {type: String, default: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')}
});
const Project = mongoose.model('project', schema, 'project');
module.exports = {
    Project,
    Dao: {
        list: async userId => {
            try {
                const result = await Project.find({userId});
                return result;
            } catch (err) {
                throw err;
            }
        },
        add: async params => {
            try {
                const userId = params.user;
                let query = {_id: userId};

                const user = await Auth.findOne(query);
                if (!user) throw {msg: '无法找到该用户'};
                params.creator = user.name || user.username;
                params.userId = userId;
                const result = await Project.create(params);
                // console.log(params, result);
                return result;
            } catch (err) {
                throw err;
            }
        },
        update: async params => {
            try {
                const result = await Project.findByIdAndUpdate(params.id, params, {
                    new: true
                }).exec();
                return result;
            } catch (err) {
                throw err;
            }
        },
        delete: async ids => {
            try {
                const result = await Project.deleteMany({_id: {$in: ids}});
                return result;
            } catch (err) {
                throw err;
            }
        }
    }
};
