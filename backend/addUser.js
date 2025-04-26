console.log("Spouštím skript addUser.js...");
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const connectDB = require("./config");

const createUser = async () => {
  await connectDB();

  const hashedPassword = bcrypt.hashSync("admin", 10);
  const user = new User({
    _id: "admin",
    username: "admin",
    password: hashedPassword,
    email: "admin@admin.admin",
    fullName: "admin",
    profile_picture: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrNZ2qZemYktaddFV5yjpT2UOuA2BPYtjD2w&s",
    bio: "admin",
    phone: "admin",
    address: "admin",
    position: "admin",
  });

  await user.save();
  console.log("Uživatel vytvořen");
  mongoose.connection.close();
};

createUser();