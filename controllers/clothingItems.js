const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
  InternalServerError,
  ForbiddenError,
} = require("../utils/errors");

// Get all clothingItems
const getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((clothingItems) => res.send(clothingItems))
    .catch((err) => {
      console.error(err);
      next(new InternalServerError("An error has occurred on the server"));
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
        return next(
          new BadRequestError("Invalid data passed to create clothing item")
        );
      }
      return next(
        new InternalServerError("An error has occurred on the server")
      );
    });
};

// Delete an Item
const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid item ID format"));
  }

  return ClothingItem.findById(itemId)
    .orFail(() => {
      const error = new NotFoundError("Item ID not found");
      throw error;
    })
    .then((item) => {
      if (item.owner.toString() !== req.user._id.toString()) {
        return next(
          new ForbiddenError("You are not authorized to delete this item")
        );
      }
      return item.deleteOne().then(() => res.send(item));
    })
    .catch((err) => {
      console.error(err);
      return next(
        new InternalServerError("An error has occurred on the server")
      );
    });
};

// Like an Item
const likeClothingItem = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
    return next(new BadRequestError("Invalid item ID format"));
  }
  return ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new NotFoundError("Item ID not found");
      throw error;
    })
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      return next(
        new InternalServerError("An error has occurred on the server")
      );
    });
};

// Dislike an Item
const dislikeClothingItem = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
    return next(new BadRequestError("Invalid item ID format"));
  }
  return ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new NotFoundError("Item ID not found");
      throw error;
    })
    .then((item) => {
      res.send(item);
    })
    .catch((err) => {
      console.error(err);
      if (!req.user) {
        return next(new UnauthorizedError("Authorization required"));
      }
      return next(
        new InternalServerError("An error has occurred on the server")
      );
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
};
