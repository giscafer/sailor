const mongoose = require('mongoose');
const config = require('../config');
const mongoUrl = config.mongoUrl;

module.exports = {
  connect: () => {
    console.log('mongoUrl=', mongoUrl);

    mongoose.connect(mongoUrl, {
      poolSize: 10,
      authSource: 'admin',
      user: config.mongodbUser,
      pass: config.mongodbPass,
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    let db = mongoose.connection;
    mongoose.Promise = global.Promise;
    db.on('connecting', () => {
      console.log('数据库连接中……');
    });
    db.on('error', (err) => {
      console.log('数据库连接出错', err);
    });
    db.on('open', () => {
      console.log('数据库连接成功');
    });
    db.on('disconnected', () => {
      console.log('数据库连接断开');
    });
  },
  mongoose,
};
