require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Create a router
const router = express.Router();

// ONE login route handler
router.post("/login", async (req, res) => {
  console.log("Login request received:", req.body);
  
  const { username, password } = req.body;

  if (!username || !password) {
    console.log("Missing username or password");
    return res.status(400).json({ message: "Vyplňte všechna pole" });
  }

  try {
    const user = await User.findOne({ username });
    console.log("User found in database:", user ? "Yes" : "No");
    
    if (!user) {
      console.log("User not found:", username);
      return res.status(400).json({ message: "Neplatné přihlašovací údaje" });
    }

    console.log("Found user data:", {
      id: user._id,
      username: user.username,
      hasBio: !!user.bio,
      hasEmail: !!user.email,
      hasFullName: !!user.fullName,
      hasProfilePic: !!user.profile_picture
    });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);
    
    if (!isMatch) {
      console.log("Password does not match for user:", username);
      return res.status(400).json({ message: "Neplatné přihlašovací údaje" });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Prepare user data for response
    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      profile_picture: user.profile_picture,
      bio: user.bio,
      phone: user.phone,
      address: user.address,
      position: user.position,
    };
    
    console.log("Sending user data in response:", userData);

    // Return user data
    return res.json({ 
      success: true,
      message: "Přihlášení úspěšné", 
      token,
      user: userData
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Chyba serveru" });
  }
});
// Export the router
module.exports = router;



// FUNKCNI ALE NEVRACI EMAIL A TAK DALE
/*require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
// ??? const { loginUser } = require("../login");

// Create a router instead of a new app
const router = express.Router();

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const result = await loginUser(username, password);
  
  return res.status(result.status).json({
    success: result.success,
    message: result.message,
    token: result.token,
    user: result.user
  });
});

// Login endpoint
router.post("/login", async (req, res) => {
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

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Return user data (excluding password)
        res.json({ 
          success: true,
          message: "Přihlášení úspěšné", 
          token,
          user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            profile_picture: user.profile_picture,
            bio: user.bio,
            phone: user.phone,
          }
        });
    //DRUHA VERZE RETURN USER DATA res.json({ message: "Přihlášení úspěšné", token, redirect: "/index.html" });
  } catch (err) {
    res.status(500).json({ message: "Chyba serveru" });
  }
  return res.status(result.status).json({
    success: result.success,
    message: result.message,
    token: result.token,  // Make sure this is being sent
    user: result.user     // Make sure user data is being sent
  });
});

// Export the router
module.exports = router;
*/
/* NEVIM CO JE TOHLE A JESTLI TO FUNGUJE KAMO
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors"); // Přidání CORS pro frontend komunikaci
const User = require("../models/User");

const app = express();
app.use(express.json());
app.use(cors()); // Povolení CORS pro frontend
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

    res.json({ message: "Přihlášení úspěšné", token, redirect: "/index.html" });
  } catch (err) {
    res.status(500).json({ message: "Chyba serveru" });
  }
});

// Spuštění serveru
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server běží na portu ${PORT}`));¨*/
