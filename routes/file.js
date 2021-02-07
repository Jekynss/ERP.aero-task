const multer = require("multer")
const fileCtrl = require('../controllers/file');
const upload = multer({ storage: fileCtrl.storage });
const FileMiddl = require('../middlewares/Files');
const { Auth } = require('../middlewares/Authentication');


module.exports = router => {
  router.post('/upload', Auth, upload.single('file'), fileCtrl.upload);
  router.get('/list', Auth, fileCtrl.list);
  router.delete('/delete/:id', Auth, FileMiddl.fileExist, fileCtrl.deleteFile);
  router.get('/:id', Auth, FileMiddl.fileExist, fileCtrl.getFileInfo);
  router.get('/download/:id', Auth, FileMiddl.fileExist, fileCtrl.getFile);
  router.put('/update/:id', Auth, FileMiddl.fileExist, upload.single('file'), fileCtrl.updateFile);
}
