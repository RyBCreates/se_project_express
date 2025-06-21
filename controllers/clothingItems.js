const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

// Get all clothingItems
const getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((clothingItems) => res.send(clothingItems))
    .catch((err) => {
      console.error(err);
      next({
        statusCode: INTERNAL_SERVER_ERROR,
        message: "An error has occured on the server",
      });
      //   res
      //     .status(INTERNAL_SERVER_ERROR)
      //     .send({ message: "An error has occurred on the server" });
    });
};

// Create a new Item
const createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  return ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);

      if (err.name === "ValidationError") {
        return next({
          statusCode: BAD_REQUEST,
          message: "Invalid data passed to create clothing item",
        });
        // return res
        //   .status(BAD_REQUEST)
        //   .send({ message: "Invalid data passed to create clothing item" });
      }
      return next({
        statusCode: INTERNAL_SERVER_ERROR,
        message: "An error has occurred on the server",
      });
      // return res
      //   .status(INTERNAL_SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server" });
    });
};

// Delete an Item
const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next({ statusCode: BAD_REQUEST, message: "Invalid item ID format" });
    // return res.status(BAD_REQUEST).send({ message: "Invalid item ID format" });
  }

  return ClothingItem.findById(itemId)
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => {
      if (item.owner.toString() !== req.user._id.toString()) {
        return next({
          statusCode: FORBIDDEN,
          message: "You are not authorized to delete this item",
        });
        // return res
        //   .status(FORBIDDEN)
        //   .send({ message: "You are not authorized to delete this item" });
      }
      return item.deleteOne().then(() => res.send(item));
    })
    .catch((err) => {
      console.error(err);
      return next({
        statusCode: err.statusCode || INTERNAL_SERVER_ERROR,
        message: err.message || "An error has occurred on the server",
      });
      // return res.status(err.statusCode || INTERNAL_SERVER_ERROR).send({
      //   message: err.message || "An error has occurred on the server",
      // });
    });
};

// Like an Item
const likeClothingItem = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
    return next({ statusCode: BAD_REQUEST, message: "Invalid item ID format" });
    // return res.status(BAD_REQUEST).send({ message: "Invalid item ID format" });
  }
  return ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      return next({
        statusCode: err.statusCode || INTERNAL_SERVER_ERROR,
        message: err.message || "An error has occurred on the server",
      });

      // return res.status(err.statusCode || INTERNAL_SERVER_ERROR).send({
      //   message: err.message || "An error has occurred on the server",
      // });
    });
};

// Dislike an Item
const dislikeClothingItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => {
      res.send(item);
    })
    .catch((err) => {
      console.error(err);
      if (!req.user) {
        return next({
          statusCode: UNAUTHORIZED,
          message: "Authorization required",
        });
        // return res
        //   .status(UNAUTHORIZED)
        //   .send({ message: "Authorization required" });
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
        return next({
          statusCode: BAD_REQUEST,
          message: "Invalid item ID format",
        });
        // return res
        //   .status(BAD_REQUEST)
        //   .send({ message: "Invalid item ID format" });
      }
      return next({
        statusCode: err.statusCode || INTERNAL_SERVER_ERROR,
        message: err.message || "An error has occurred on the server",
      });
      // return res.status(err.statusCode || INTERNAL_SERVER_ERROR).send({
      //   message: err.message || "An error has occurred on the server",
      // });
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
};
