require("dotenv").config();
const mongoose = require("mongoose");

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, options);
  } catch (err) {
    console.log(err);
  }
};
module.exports = connectToMongo;
