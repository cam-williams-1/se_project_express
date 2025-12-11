const router = require("express").Router();
const { NOT_FOUND } = require("../utils/errors");

// Imported route handlers
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");

// Specific routes
router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

// Any requests to undefined routes
router.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

module.exports = router;
