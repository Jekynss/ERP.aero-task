

const db = require('../models');
const fileExist = async function (req, res, next) {
  try {
    const { id } = req.params;
    const file = await db.files.findOne({ where: { id } });
    if (!file) {
      throw { status: 404, message: 'File not found' };
    }
    req.existFile = file;
    next();
  } catch (err) {
    const status = err.status ? err.status : 500;
    return res.status(status).json({ msg: err.message, error: true });
  }
};

module.exports = {
  fileExist
};
