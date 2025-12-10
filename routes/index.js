const router = require("express").Router();

// Imported route handlers
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");

// Specific routes
router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

// Any requests to undefined routes
router.use((req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});

module.exports = router;
