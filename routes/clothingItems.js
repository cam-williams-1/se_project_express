const router = require("express").Router();
const auth = require("../middlewares/auth");
const { validateCardBody, validateId } = require("../middlewares/validation");

const {
  createItem,
  getItems,
  deleteItemById,
  addItemLike,
  deleteItemLike,
} = require("../controllers/clothingItems");

// should be protected before auth middleware
router.get("/", getItems);

// CRUD
router.use(auth);

// C -- creates a new clothing item
router.post("/", validateCardBody, createItem);

// R -- gets all clothing items

// U -- adds a like to a clothing item by ID
router.put("/:itemId/likes", validateId, addItemLike);

// D -- deletes a like from a clothing item by ID
router.delete("/:itemId/likes", validateId, deleteItemLike);

// D -- deletes a clothing item by ID
router.delete("/:itemId", validateId, deleteItemById);

module.exports = router;
