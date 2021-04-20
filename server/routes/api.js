const router = require('koa-router')();
const getUser = require('../middleware/getUser');
const authCtrl = require('../controller/user');
// const userLogin = require('../middleware/userLogin');
router.prefix('/api');
//登录
router.post('/auth/login', authCtrl.login);
router.get('/auth/user', getUser(), authCtrl.getUser);
router.post('/auth/logout', async ctx => {
    ctx.body = null;
});
// router.post('/robot/room/say', userLogin(), robotCtrl.roomSay)
// router.get('/robot/room/:id', userLogin(), robotCtrl.getRoom)
// router.put('/robot/room/:id', userLogin(), robotCtrl.updateRoom)
// router.delete('/admin/reply', sysCtrl.deleteReply);

module.exports = router;
