exports.authenticated = function(req, res, next) {
  if (!req.isAuthenticated()) return res.status(401).json({message: "Not authenticated"});
  return next();
}
exports.notAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) return res.status(403).json({message: "Already authenticated"});
  return next();
}