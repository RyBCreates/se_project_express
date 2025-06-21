const jwt = require("jsonwebtoken");
const { UNAUTHORIZED } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next({ status: UNAUTHORIZED, message: "Authorization required" });
    // return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }
  const token = authorization.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    console.error(err);
    return next({ status: UNAUTHORIZED, message: "Invalid Token" });
  }
  // catch (err) {
  //   return res.status(UNAUTHORIZED).send({ message: "Invalid token" });
  // }
};

module.exports = auth;
