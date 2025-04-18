const express = require("express");
const connectDB = require("./config");
require("dotenv").config();
const cors = require('cors');
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

const loginRoutes = require("./routes/loginRoutes");
const userRoutes = require("./routes/authRoutes");
    
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Povolit přístup ze všech domén
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    },
});

// Připojení k databázi
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", require("./routes/authRoutes")); // This will handle /api/auth/login and /api/auth/register
app.use("/api/users", userRoutes);

// ✅ Definujeme model pro zprávy v chatu
const MessageSchema = new mongoose.Schema({
    username: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", MessageSchema);

// ✅ WebSocket logika
io.on("connection", async (socket) => {
    console.log(`Uživatel ${socket.id} se připojil`);

    // Při připojení pošli staré zprávy z databáze
    const messages = await Message.find().sort({ timestamp: 1 }).limit(50);
    socket.emit("load messages", messages);

    // Když přijde nová zpráva
    socket.on("chat message", async ({ username, message }) => {
        console.log(`Nová zpráva od ${username}: ${message}`);

        // Ulož zprávu do databáze
        const newMessage = new Message({ username, message });
        await newMessage.save();

        // Pošli zprávu všem připojeným uživatelům
        io.emit("chat message", newMessage);
    });

    socket.on("disconnect", () => {
        console.log(`Uživatel ${socket.id} se odpojil`);
    });
});

// Spuštění serveru
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server běží na http://localhost:${PORT}`));




/* jina verze
    const express = require('express');
const connectDB = require('./config');
const loginRoutes = require('./routes/loginRoutes');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(cors()); // Důležité pro komunikaci mezi Electron app a API serverem

// Routes
app.use('/api', loginRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const userRoutes = require('./routes/authRoutes');
app.use('/api/users', userRoutes);*/
