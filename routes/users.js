const router = require("express").Router();
const { getUsers, getUser, createUser } = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUser);
router.post(
  "/",
  (req, res, next) => {
    next();
  },
  createUser
);

module.exports = router;
