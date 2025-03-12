require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");  

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("✅ Připojeno k MongoDB!");
    const users = await User.find();
    console.log("👥 Nalezeni uživatelé:", users);
    mongoose.connection.close();
  })
  .catch((err) => console.error("❌ Chyba připojení:", err));
