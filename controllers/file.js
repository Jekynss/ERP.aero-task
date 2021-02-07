const db = require('../models');
const multer = require("multer")
var rimraf = require("rimraf");
const fileDir = process.env.FILE_BUCKET;
const fs = require("fs");

const createFileDir = () => {
  const folders = fileDir.split('/');
  let path = '';
  for (let folder of folders) {
    path += `${folder}/`;
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    createFileDir();
    cb(null, fileDir)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
})

const createFileObject = (name, extension, mime, size, updatedAt, createdAt) => {
  fileObject = {
    name,
    extension,
    mime,
    size,
    updatedAt
  };
  if (createdAt) {
    fileObject.createdAt = createdAt;
  }
  return fileObject;

}

const upload = function (req, res, next) {
  try {
    if (!req.file) {
      throw { message: 'The file was not uploaded' };
    }
    const { originalname, mimetype, size } = req.file;
    const fileExtension = originalname.split('.').pop();
    const filename = originalname.substr(0, (originalname.length - fileExtension.length) - 1);
    const fileObject = createFileObject(filename, fileExtension, mimetype, size, new Date(), new Date());
    db.files.create(fileObject)
    return res.status(200).json({ msg: 'File was uploaded', error: false });
  } catch (err) {
    return res.status(500).json({ msg: err.message, error: true })
  }
}

const list = async function (req, res, next) {
  try {
    const list_size = req.query.list_size ? req.query.list_size : 10;
    const page_offset = req.query.page ? list_size * (req.query.page - 1) : 0;
    const files = await db.files.findAll({
      limit: +list_size,
      offset: +page_offset,
      order: [
        ['id', 'DESC']
      ],
    })
    return res.status(200).json({ files, error: false });
  }
  catch (err) {
    return res.status(500).json({ msg: err.message, error: true })
  }
}

const deleteFile = async function (req, res, next) {
  try {
    const file = req.existFile;
    const { name, extension } = file;
    const filePath = `./${fileDir}/${name}.${extension}`;
    if (fs.existsSync(filePath)) {
      rimraf.sync(filePath);
    }
    file.destroy({});
    return res.status(200).json({ msg: 'File deleted', error: false });
  }
  catch (err) {
    return res.status(500).json({ msg: err.message, error: true })
  }
}

const getFileInfo = async function (req, res, next) {
  try {
    return res.status(200).json({ info: req.existFile, error: false });
  }
  catch (err) {
    return res.status(500).json({ msg: err.message, error: true })
  }
}

const getFile = async function (req, res, next) {
  try {
    const { name, extension } = req.existFile;
    const filePath = `./${fileDir}/${name}.${extension}`;
    if (!fs.existsSync(filePath)) {
      throw { message: 'File deleted' };
    }
    return res.status(200).download(filePath);
  }
  catch (err) {
    return res.status(500).json({ msg: err.message, error: true })
  }
}

const updateFile = async function (req, res, next) {
  try {
    const file = req.existFile;
    const { originalname, mimetype, size } = req.file;
    const fileExtension = originalname.split('.').pop();
    const filename = originalname.substr(0, (originalname.length - fileExtension.length) - 1);

    const oldFilePath = `./${fileDir}/${file.name}.${file.extension}`;
    if (fs.existsSync(oldFilePath)) {
      rimraf.sync(oldFilePath);
    }
    const fileObject = createFileObject(filename, fileExtension, mimetype, size, new Date());
    const updatedFile = await file.update(fileObject);
    if (!updatedFile) {
      throw { message: 'File not changed' };
    }
    return res.status(200).json({ msg: 'File changed', error: false });
  }
  catch (err) {
    return res.status(500).json({ msg: err.message, error: true })
  }
}

module.exports = {
  upload,
  getFile,
  updateFile,
  getFileInfo,
  list,
  deleteFile,
  storage
}