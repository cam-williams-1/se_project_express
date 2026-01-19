const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require("../middlewares/custom-errors");

// DELETE and DELETE utils/errors.js
// const {
//   BAD_REQUEST,
//   NOT_FOUND,
//   INTERNAL_SERVER_ERROR,
//   FORBIDDEN,
// } = require("../utils/errors");

// Create a new clothing item
const createItem = (req, res, next) => {
  const { name, imageUrl, weather } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid Data"));
      } else {
        next(err);
      }
    });
};

// Get all clothing items
const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => next(err));
};

// Delete a clothing item by ID
const deleteItemById = (req, res, next) => {
  const { itemId } = req.params;

  // DOT suggested a confusing fix to this...
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id.toString()) {
        next(new ForbiddenError("Unauthorized Action"));
      }
      return res.status(200).send(item); // to ensure deletion after user is authorized
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Data Not Found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid Data"));
      } else {
        next(err);
      }
    });
};

const addItemLike = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Data Not Found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid Data"));
      } else {
        next(err);
      }
    });
};

const deleteItemLike = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Data Not Found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid Data"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItemById,
  addItemLike,
  deleteItemLike,
};
