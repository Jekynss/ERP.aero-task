const jwt = require("jsonwebtoken");
const jwtsecret = "mysecretkey";
const db = require('../models');
/* GET users listing. */

const Auth = function (req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  jwt.verify(token, jwtsecret, async function (err, decoded) {
    if (err) {
      return res.status(401).json({ msg: "invalid token", error: true });
    }

    const user = await db.Users.findOne({ 
      where: { 
        id: decoded.id
      },
      include: [{
        model: db.Tokens,
        as: "refresh_token",
      }]
    });

    if (!user.refresh_token.refresh_token) {
      return res.status(401).json({ msg: "You are not authorized", error: true });
    }

    if(!user)
      return res.status(404).json({ msg: "User not found", error: true });

    req.body.user = user;
    next();
  });
};

module.exports = {
  Auth
};
