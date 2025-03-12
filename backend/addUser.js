console.log("Spouštím skript addUser.js...");
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const connectDB = require("./config");

const createUser = async () => {
  await connectDB();

  const hashedPassword = bcrypt.hashSync("1234", 10);
  const user = new User({ 
    username: "1234",
    password: hashedPassword,
    email: "1234@1234.com",
    fullName: "1324 5678",
  });

  await user.save();
  console.log("Uživatel vytvořen");
  mongoose.connection.close();
};

createUser();
