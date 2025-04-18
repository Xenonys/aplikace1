// login.js - now a utility module, not a server
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

// Login function
async function loginUser(username, password) {
  try {
    if (!username || !password) {
      return { success: false, message: "Vyplňte všechna pole", status: 400 };
    }

    const user = await User.findOne({ username });

    if (!user) {
      return { success: false, message: "Neplatné přihlašovací údaje", status: 400 };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, message: "Neplatné přihlašovací údaje", status: 400 };
    }

    // Vytvoření JWT tokenu
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return {
      success: true,
      message: "Přihlášení úspěšné",
      token,
      user: {
        id: user._id,
        username: user.username,
        // Add other user fields as needed, excluding password
      },
      status: 200
    };
  } catch (err) {
    console.error("Login error:", err);
    return { success: false, message: "Chyba serveru", status: 500 };
  }
}

module.exports = { loginUser };


/*
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

const app = express();
app.use(express.json());

// Připojení k MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB připojena"))
  .catch((err) => console.error("Chyba připojení k MongoDB:", err));

// Přihlašovací endpoint
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Vyplňte všechna pole" });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Neplatné přihlašovací údaje" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Neplatné přihlašovací údaje" });
    }

    // Vytvoření JWT tokenu
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Přihlášení úspěšné", token });
  } catch (err) {
    res.status(500).json({ message: "Chyba serveru" });
  }
});

// Spuštění serveru
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server běží na portu ${PORT}`)); */
