const User = require('../models/user')
const jwt = require('jsonwebtoken')

exports.authenticated = function(req, res, next) {
  if (!req.user) return res.status(401).json({message: "Not authenticated"});
  return next();
}
exports.notAuthenticated = function (req, res, next) {
  if (req.user) return res.status(403).json({message: "Already authenticated"});
  return next();
}

exports.jwt = () => (req, res, next) => {
  let token = req.headers['authorization'];
  if(!token) return next()
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if(err) return res.status(401).json({message: err})
    User.findById(decoded._id).then(user => {
        // if(!user) return res.status(401).json({redirect: '/login'})
        req.user = user;
        next();
    }).catch(next);
  });
};