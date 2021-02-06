const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtsecret = "mysecretkey";
/* GET users listing. */
const db = require('../models');

const userRegistration = async function (req, res) {//register
  try {
    bcrypt.genSalt(12, function (err, salt) {
      bcrypt.hash(req.body.password, salt, async function (err, hash) {
        const [user, created] = await db.Users.findOrCreate({
          where: { id: req.body.login }, defaults: {
            password: hash
          }
        });
          if (!created) {
            return res.status(400).json({ msg: 'login already taken', error: true });
          }
          const token = jwt.sign({ id: user.id }, jwtsecret, { expiresIn: 600 });
          const refresh_token = jwt.sign({ id: user.id }, jwtsecret, { expiresIn: 86400 });
            db.Tokens.create({user_id: user.id, refresh_token});
            return res.status(200).json({ msg: 'Success! you have been registered', error: false, user, access_token: token, refresh_token });
      });
    });
  } catch (err) {
    if (err.status == 400) {
      return res.status(400).json({ msg: err.message, error: true });
    }
    return res.status(500).json({ msg: err.message, error: true })
  }
}

const userLogin = async function (req, res) {//login
  if (!req.body.login) {
    return res.status(401).json({ msg: 'No login', error: true });
  }
  const user = await db.Users.findOne({
    where: { id: req.body.login },
    include: [{
      model: db.Tokens,
      as: "refresh_token",
    }]
  });

  if (user) {
    bcrypt.compare(req.body.password, user.password, async function (err, hash) {
      if (hash) {
        let token = jwt.sign({ id: user.id }, jwtsecret, { expiresIn: 600 });
        let refresh_token = jwt.sign({ id: user.id }, jwtsecret, { expiresIn: 86400 });
        let userObj = { ...user.dataValues };
        delete userObj.password;
        delete userObj.refresh_token;
        const oldRefreshToken = await db.Tokens.findOne({where: {user_id: user.id}})
        if(oldRefreshToken) {
          oldRefreshToken.update({refresh_token});
        }
        return res.status(200).json({ msg: 'success', error: false, refresh_token, token, user: userObj });
      }

      return res.status(401).json({ msg: 'wrong credentials', error: true });

    });
  }
  else {
    return res.status(401).json({ msg: 'wrong credentials', error: true });
  }
}

const userLogout = async function (req, res) {
  const { user } = req.body;

  const userToken = await db.Tokens.findOne({ 
    where: {
      user_id: user.id
    } 
  })
  await userToken.update({ refresh_token: null });
  return res.status(200).json({ msg: "Successfully logout", error: false});
}

const userInfo = function (req, res) {
  return res.status(200).json({ msg: req.body.user.id, error: false});
}

const newToken = async function (req, res) {
  jwt.verify(req.body.refreshToken, jwtsecret, async function (err, refresh_decoded) {
    if(err){
      return res.status(401).json({ msg: "invalid refresh token", error: true });
    }

    user = await db.Users.findOne({ where: { 
      id: refresh_decoded.id
    }});

    if(!user)
      return res.status(404).json({ msg: "User not found", error: true });

    let token = jwt.sign({ id: user.id, login: user.login, role: user.role }, jwtsecret, { expiresIn: 600 });
    return res.status(200).json({ msg: "New access token", access_token:token, error: true });
  });
}

module.exports = {
  userRegistration,
  userLogin,
  userLogout,
  userInfo,
  newToken
}