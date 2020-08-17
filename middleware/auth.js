const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    res.status(401).json({msg: "premision denied"});
  }

  try {
    var secretOrPrivateKey = "whatever";
    var decoded = jwt.verify(token, secretOrPrivateKey);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.send(error);
  }
};
