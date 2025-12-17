const router = require("express").Router();
const { NOT_FOUND } = require("../utils/errors");

const { login, createUser } = require("../controllers/users");

// Imported route handlers
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");

// Specific routes
router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

// Logging routes
router.post("/signin", login);
router.post("/signup", createUser);

// Any requests to undefined routes
router.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

module.exports = router;
