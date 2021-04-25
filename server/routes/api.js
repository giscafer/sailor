const router = require('koa-router')();
const getUser = require('../middleware/getUser');
const authCtrl = require('../controller/user');
const projectCtrl = require('../controller/project');
// const userLogin = require('../middleware/userLogin');
router.prefix('/api');
//登录
router.post('/auth/login', authCtrl.login);
router.get('/auth/user', getUser(), authCtrl.getUser);
router.post('/auth/logout', async ctx => {
    ctx.body = null;
});
// project
router.get('/project/info/:id', getUser(), projectCtrl.getProject);
router.post('/project/add', getUser(), projectCtrl.add);
router.post('/project/update', getUser(), projectCtrl.update);
router.get('/project/list', getUser(), projectCtrl.getList);
router.post('/project/del', getUser(), projectCtrl.delete);
router.post('/project/exportZip', getUser(), projectCtrl.exportZip);

// router.get('/robot/room/:id', userLogin(), robotCtrl.getRoom)
// router.put('/robot/room/:id', userLogin(), robotCtrl.updateRoom)
// router.delete('/admin/reply', sysCtrl.deleteReply);

module.exports = router;
