const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
} = require("../controllers/clothingItems");

// const { getUsers, getUser, createUser } = require("../controllers/users");

router.get("/", getClothingItems);
router.post("/", createClothingItem);
router.delete("/", deleteClothingItem);

// router.get("/", getUsers);
// router.get("/:userId", getUser);
// router.post(
//   "/",
//   (req, res, next) => {
//     console.log("Route handler reached - POST /api/users");
//     next();
//   },
//   createUser
// );

module.exports = router;
