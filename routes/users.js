const router = require("express").Router();
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const {
  validateUserLogin,
  validateUserSignup,
} = require("../middlewares/validation");

router.get("/me", auth, validateUserLogin, getCurrentUser);
router.patch("/me", auth, validateUserSignup, updateCurrentUser);

module.exports = router;
