const ClothingItem = require("../models/clothingItem");

// Get all clothingItems
const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((clothingItems) => res.send(clothingItems))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "An error has occurred on the server" });
    });
};

// Create a new Item
const createClothingItem = (req, res) => {
  const { name, weather, imageUrl, owner } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Invalid data passed to create clothing item" });
      }
      return res
        .status(500)
        .send({ message: "An error has occurred on the server" });
    });
};

// Delete an Item
const deleteClothingItem = (req, res) => {
  console.log("Deleted Item");
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
};
