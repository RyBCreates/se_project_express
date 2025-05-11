const router = require("express").Router();
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.get("/users/me", auth, getCurrentUser);
router.patch("/users/me", auth, updateCurrentUser);

module.exports = router;
