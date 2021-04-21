const {mongoose} = require('../config/db');
const Schema = mongoose.Schema;
const schema = new Schema({
    name: String,
    username: {
        type: String,
        required: true
    },
    password: String,
    salt: String,
    createTime: {type: Date, default: new Date()},
    lastLoginT: Date,
    loginIp: String
});

const Auth = mongoose.model('auth', schema, 'auth');
const {encryptPassword, createToken} = require('../utils/encrypt');
module.exports = {
    Auth,
    Dao: {
        login: async params => {
            try {
                const user = await Auth.findOne({username: params.username});
                if (!user) throw {message: '用户不存在'};
                if (user.password != encryptPassword(user.salt, params.password)) throw {message: '密码有误'};
                return {token: createToken({id: user.id})};
            } catch (err) {
                throw err;
            }
        },
        getUser: async userId => {
            try {
                const user = await Auth.findOne({_id: userId}, {username: 1});
                // const robot = await Projects.findOne({user: user._id}, {id: 1});
                return {
                    username: user.username,
                    name: user.name || user.username
                    // robotId: (robot && robot.id) || null,
                    // robot_id: (robot && robot._id) || null
                };
            } catch (err) {
                throw err;
            }
        }
    }
};
// 初始化用户
const init = async () => {
    const exists = await Auth.exists({});
    if (!exists) {
        await Auth.create({
            name: '管理员',
            username: 'admin',
            salt: '123456',
            password: encryptPassword('123456', '111111')
        });
        await Auth.create({
            name: '游客',
            username: 'guest',
            salt: '123456',
            password: encryptPassword('123456', '111111')
        });
    }
};
init();
