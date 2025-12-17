const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItemById,
  addItemLike,
  deleteItemLike,
} = require("../controllers/clothingItems");

// CRUD
router.use(auth);

// C -- creates a new clothing item
router.post("/", createItem);

// R -- gets all clothing items
router.get("/", getItems);

// U -- adds a like to a clothing item by ID
router.put("/:itemId/likes", addItemLike);

// D -- deletes a like from a clothing item by ID
router.delete("/:itemId/likes", deleteItemLike);

// D -- deletes a clothing item by ID
router.delete("/:itemId", deleteItemById);

module.exports = router;
