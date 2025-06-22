const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateCreateClothingItem,
  validateItemId,
} = require("../middlewares/validation");

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
} = require("../controllers/clothingItems");

router.get("/", getClothingItems);
router.post("/", auth, validateCreateClothingItem, createClothingItem);
router.delete("/:itemId", auth, validateItemId, deleteClothingItem);
router.put("/:itemId/likes", auth, validateItemId, likeClothingItem);
router.delete("/:itemId/likes", auth, validateItemId, dislikeClothingItem);

module.exports = router;
