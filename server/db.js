const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("error .env");

  await mongoose.connect(uri);
  console.log("connected");
}

module.exports = { connectDB };