const express = require("express");
const mongoose = require("mongoose");

const mainRouter = require("./routes/index");

const app = express();

app.use(express.json());

// Mock user middleware
app.use((req, res, next) => {
  req.user = {
    _id: "69399cee3af977f43f7956de",
  };
  next();
});

const { PORT = 3001 } = process.env;

app.listen(3001, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// currently set to local host MongoDB, with name wtwr_db
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(console.error);

app.use("/", mainRouter);

module.exports.createClothingItem = (req, res) => {
  console.log(req.user._id);
};
