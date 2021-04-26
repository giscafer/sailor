const moment = require('moment');
const { mongoose } = require('../config/db');
const Schema = mongoose.Schema;
const schema = new Schema({
  name: String,
  username: {
    type: String,
    required: true,
  },
  password: String,
  salt: String,
  createTime: {
    type: String,
    default: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
  },
  lastLoginT: Date,
  loginIp: String,
});

const Auth = mongoose.model('auth', schema, 'auth');
const { encryptPassword, createToken } = require('../utils/encrypt');
module.exports = {
  Auth,
  Dao: {
    login: async (params) => {
      try {
        const user = await Auth.findOne({ username: params.username });
        if (!user) throw { message: '用户不存在' };
        if (user.password != encryptPassword(user.salt, params.password))
          throw { message: '密码有误' };
        return { token: createToken({ id: user.id }) };
      } catch (err) {
        throw err;
      }
    },
    getUser: async (userId) => {
      try {
        const user = await Auth.findOne({ _id: userId });
        return {
          username: user.username,
          name: user.name || user.username,
        };
      } catch (err) {
        throw err;
      }
    },
  },
};
// 初始化用户
const init = async () => {
  const exists = await Auth.exists({});
  if (!exists) {
    await Auth.create({
      name: '管理员',
      username: 'admin',
      salt: 'giscafer',
      password: encryptPassword('giscafer', 'Admin@123'),
    });
    await Auth.create({
      name: '游客',
      username: 'guest',
      salt: 'giscafer',
      password: encryptPassword('giscafer', '123456'),
    });
  }
};
init();
