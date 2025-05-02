const router = require("express").Router();
const { getUsers, getUser, createUser } = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUser);
router.post(
  "/",
  (req, res, next) => {
    console.log("Route handler reached - POST /api/users");
    next();
  },
  createUser
);

module.exports = router;
