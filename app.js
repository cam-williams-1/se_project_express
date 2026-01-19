const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const errorHandler = require("./middlewares/error-handler");

const app = express();

app.use(express.json());
app.use(cors());

const mainRouter = require("./routes/index");

const { PORT = 3001 } = process.env;

app.listen(PORT, () => {
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

app.use(errorHandler);
