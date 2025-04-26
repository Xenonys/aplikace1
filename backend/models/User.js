const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // ✅ Import uuidv4

const UserSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashované heslo
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  profile_picture: {type: String, default: "https://i.pinimg.com/736x/2f/15/f2/2f15f2e8c688b3120d3d26467b06330c.jpg"},
  bio: {type: String, default: "Tento uživatel zatím nemá popisek."},
  phone: {type: String, required:true ,unique: true,},
  address: {type: String, required:true, unique: true,},
  position: {type: String, default: "Zaměstnanec"},
});

module.exports = mongoose.model("User", UserSchema, "users");
