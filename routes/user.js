const { Auth } = require('../middlewares/Authentication');
const userCtrl = require('../controllers/user');


module.exports = router => {
  router.post('/singup', userCtrl.userRegistration);
  router.post('/singin', userCtrl.userLogin);
  router.post('/singin/new_token', userCtrl.newToken);
  router.get('/info', Auth, userCtrl.userInfo);
  router.get('/logout', Auth, userCtrl.userLogout);
}
