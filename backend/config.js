const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ MongoDB Atlas připojeno');
    } catch (err) {
        console.error('❌ Chyba připojení k MongoDB:', err);
        process.exit(1);
    }
};

module.exports = connectDB;





/*console.log("Spouštím skript addUser.js...");
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const connectDB = require("./config");

console.log(typeof connectDB); // Log the type of connectDB to verify the import

const createUser = async () => {
  await connectDB();

  const hashedPassword = bcrypt.hashSync("heslo123", 10);
  const user = new User({ name: "Admin", email: "admin@email.com", password: hashedPassword });

  await user.save();
  console.log("Uživatel vytvořen");
  mongoose.connection.close();
};

createUser();

// Funkce pro připojení k databázi
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Připojeno k MongoDB");
  } catch (error) {
    console.error("❌ Chyba připojení k databázi:", error);
    process.exit(1);
  }
};

module.exports = connectDB;*/
