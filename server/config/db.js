const mongoose = require("mongoose");

const connectDB = async () => {
  const uri =
    process.env.NODE_ENV === "test"
      ? process.env.MONGODB_URI_TEST
      : process.env.MONGODB_URI;

  await mongoose.connect(uri);
};

module.exports = connectDB;
