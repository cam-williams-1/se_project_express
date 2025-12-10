const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

// Create a new clothing item
const createItem = (req, res) => {
  const { name, imageUrl, weather } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

// Get all clothing items
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) =>
      res.status(INTERNAL_SERVER_ERROR).send({ message: err.message })
    );
};

// Delete a clothing item by ID
const deleteItemById = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      if (err.name === "CastError")
        return res.status(BAD_REQUEST).send({ message: err.message });
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

const addItemLike = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((err) => {
      if (!itemId) {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      if (itemId === null) {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

const deleteItemLike = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(itemId, { $pull: { likes: req.user._id } })
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      if (!itemId) {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      if (itemId === null) {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItemById,
  addItemLike,
  deleteItemLike,
};
