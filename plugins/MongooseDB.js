const mongoose = require("mongoose");
const colors = require("colors");
let control = false;

const connectToDatabase = async () => {
  if (!control) {
    return false;
  }
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log(colors.bgGreen("[INFO] Mongoose | Connected to MongoDB"));
    return true;
  } catch (error) {
    console.error(colors.bgRed("[INFO] Mongoose | Not Connected to MongoDB:"));
    return false;
  }
};

module.exports = connectToDatabase;
