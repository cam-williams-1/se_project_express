const router = require("express").Router();
const NotFoundError = require("../errors/NotFoundError");
const {
  validateUserBody,
  validateAuthentication,
} = require("../middlewares/validation");

const { login, createUser } = require("../controllers/users");

// Imported route handlers
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");

// Specific routes
router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

// Logging routes
router.post("/signin", validateAuthentication, login);
router.post("/signup", validateUserBody, createUser);

// Any requests to undefined routes
router.use((req, res) => {
  return next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
