const router = require("express").Router();
const { getUsers, createUser, getUser } = require("../controllers/users");

// returns all users
router.get("/", getUsers);

// returns a user by their userId
router.get("/:userId", getUser);

// creates a new user
router.post("/", createUser);

module.exports = router;
