const {mongoUrl} = require('../config');
const mongoose = require('mongoose');

module.exports = {
    connect: () => {
        if (mongoUrl.includes('127.0.0.1')) {
            // 本地
            mongoose.connect(mongoUrl, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                auth: {
                    authdb: 'admin',
                    user: 'webgis',
                    password: 'giscafer'
                }
            });
        }
        mongoose.connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        mongoose.set('useFindAndModify', false);
        mongoose.set('useCreateIndex', true);
        let db = mongoose.connection;
        mongoose.Promise = global.Promise;
        db.on('connecting', () => {
            console.log('数据库连接中……');
        });
        db.on('error', err => {
            console.log('数据库连接出错', err);
        });
        db.on('open', () => {
            console.log('数据库连接成功');
        });
        db.on('disconnected', () => {
            console.log('数据库连接断开');
        });
        /*   db.on('timeout', () => {
            console.log('数据库连接失败，请检查mongod服务是否启动');
        }); */
    },
    mongoose
};
