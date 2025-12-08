const mongoose = require("mongoose");
const validator = require("validator");

const clothingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  imageUrl: {
    type: String,
    required: [true, "The image field is required"],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  // Need to finish the schema
  weather: {},
  owner: {},
  likes: {},
  createdAt: {},
});

module.exports = mongoose.model("user", clothingSchema);
