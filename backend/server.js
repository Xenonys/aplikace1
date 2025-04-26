/*const express = require('express'); NEFUNGUJE ALE JE TO S CHATEM

const connectDB = require('./config');
const loginRoutes = require('./routes/loginRoutes');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const fs = require('fs');
const { Server } = require('socket.io');

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
app.use('/api/users', userRoutes);
app.use("/api/auth", require("./routes/authRoutes"));

// Set up Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// In-memory store for active users and chats (in production, use a database)
const activeUsers = {};
const chatRooms = {};

// Socket.io connection handler
io.on('connection', (socket) => {
  const username = socket.handshake.query.username || 'Anonymous';
  console.log(`User connected: ${username} (${socket.id})`);
  
  // Store user info
  activeUsers[socket.id] = {
    username,
    socketId: socket.id
  };
  
  // Get chats for this user (in a real app, get from database)
  socket.on('get chats', async (username) => {
    try {
      // In a real app, query the database for this user's chats
      // For now, we'll use in-memory data
      const userChats = Object.values(chatRooms).filter(chat => 
        chat.participants.includes(username)
      );
      
      socket.emit('chat history', userChats);
    } catch (error) {
      console.error('Error getting chat history:', error);
    }
  });
  
  // New message handler
  socket.on('new message', (message) => {
    console.log('New message:', message);
    
    // Store the message (in a real app, save to database)
    if (chatRooms[message.chatId]) {
      chatRooms[message.chatId].messages.push(message);
    }
    
    // Broadcast to all users in this chat
    io.emit('new message', message);
  });
  
  // Typing indicators
  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data);
  });
  
  socket.on('stop typing', (data) => {
    socket.broadcast.emit('stop typing', data);
  });
  
  // Get user profile
  socket.on('get user profile', async (username) => {
    try {
      // In a real app, query the database for user profile
      // For now, we'll use a mock response
      const user = await User.findOne({ username });
      if (user) {
        socket.emit('user profile', {
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          bio: user.bio,
          profile_picture: user.profile_picture,
          position: user.position || 'Uživatel',
          address: user.address
        });
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
    }
  });
  
  // Disconnect handler
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${activeUsers[socket.id]?.username}`);
    delete activeUsers[socket.id];
  });
});

// Initialize some mock chat rooms
function initMockChats() {
  chatRooms['team-chat'] = {
    id: 'team-chat',
    name: 'Team Chat',
    isGroup: true,
    participants: ['Sabrinka', 'Pepa', 'Vasa', 'Franta'],
    avatar: 'https://i.pravatar.cc/150?img=1',
    messages: [
      {
        chatId: 'team-chat',
        sender: 'Pepa',
        text: 'Ahoj týme, jak se máte?',
        timestamp: '2023-09-10T08:30:00.000Z'
      },
      {
        chatId: 'team-chat',
        sender: 'Vasa',
        text: 'Všechno v pohodě, pracuji na nových funkcích',
        timestamp: '2023-09-10T08:32:00.000Z'
      }
    ]
  };
  
  chatRooms['chat-pepa'] = {
    id: 'chat-pepa',
    isGroup: false,
    participants: ['Sabrinka', 'Pepa'],
    avatar: 'https://i.pravatar.cc/150?img=3',
    messages: [
      {
        chatId: 'chat-pepa',
        sender: 'Pepa',
        text: 'Ahoj Sabrino, můžeš mi pomoct s tím novým projektem?',
        timestamp: '2023-09-11T10:15:00.000Z'
      }
    ]
  };
}

// Call this after setting up the server
initMockChats(); */

const express = require("express");
const connectDB = require("./config");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

const loginRoutes = require("./routes/loginRoutes");
const userRoutes = require("./routes/authRoutes");

const app = express();

// Create the HTTP server
const server = http.createServer(app);

// Then create the Socket.io server using that HTTP server
const io = new Server(server, {
    cors: {
        origin: "*", // Povolit přístup ze všech domén
        methods: ["GET", "POST"],
    },
});

// Připojení k databázi
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", userRoutes);

// ✅ Definujeme model pro zprávy v chatu
const MessageSchema = new mongoose.Schema({
    username: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", MessageSchema);

// In-memory store for active users and chats
const activeUsers = {};
const chatRooms = {};

// ✅ WebSocket logika
io.on("connection", (socket) => {
    const username = socket.handshake.query.username || 'Anonymous';
    console.log(`User connected: ${username} (${socket.id})`);
    
    // Store user info
    activeUsers[socket.id] = {
        username,
        socketId: socket.id
    };
    
    // Get chats for this user
    socket.on('get chats', async (username) => {
        try {
            // In a real app, query the database for this user's chats
            // For now, we'll use in-memory data
            const userChats = Object.values(chatRooms).filter(chat => 
                chat.participants.includes(username)
            );
            
            socket.emit('chat history', userChats);
        } catch (error) {
            console.error('Error getting chat history:', error);
        }
    });
    
    // New message handler
    socket.on('new message', (message) => {
        console.log('New message:', message);
        
        // Store the message (in a real app, save to database)
        if (chatRooms[message.chatId]) {
            chatRooms[message.chatId].messages.push(message);
        }
        
        // Broadcast to all users in this chat
        io.emit('new message', message);
    });
    
    // Typing indicators
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
    });
    
    socket.on('stop typing', (data) => {
        socket.broadcast.emit('stop typing', data);
    });
    
    // Get user profile
    socket.on('get user profile', async (username) => {
        try {
            // In a real app, query the database for user profile
            const user = await mongoose.model("User").findOne({ username });
            if (user) {
                socket.emit('user profile', {
                    username: user.username,
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phone,
                    bio: user.bio,
                    profile_picture: user.profile_picture,
                    position: user.position || 'Uživatel',
                    address: user.address
                });
            }
        } catch (error) {
            console.error('Error getting user profile:', error);
        }
    });
    
    // Old chat message handling (for compatibility)
    socket.on("chat message", async ({ username, message }) => {
        console.log(`Nová zpráva od ${username}: ${message}`);

        // Ulož zprávu do databáze
        const newMessage = new Message({ username, message });
        await newMessage.save();

        // Pošli zprávu všem připojeným uživatelům
        io.emit("chat message", newMessage);
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${activeUsers[socket.id]?.username}`);
        delete activeUsers[socket.id];
    });
// Handle creating new chats
socket.on('create chat', (chat) => {
  // Store chat in our in-memory store
  chatRooms[chat.id] = chat;
  
  // Broadcast to all participants
  chat.participants.forEach(participant => {
      // Find sockets for this username
      Object.values(activeUsers).forEach(user => {
          if (user.username === participant) {
              io.to(user.socketId).emit('new chat', chat);
          }
      });
  });
});
});

// Initialize some mock chat rooms
function initMockChats() {
  chatRooms['team-chat'] = {
      id: 'team-chat',
      name: 'Team Chat',
      isGroup: true,
      participants: ['Sabrina', 'Pepa', 'Vasa', 'Franta', '1234', 'admin', 'Sabrinaa'],
      avatar: 'https://i.pravatar.cc/150?img=1',
      messages: [
          {
              chatId: 'team-chat',
              sender: 'Pepa',
              text: 'Ahoj týme, jak se máte?',
              timestamp: '2023-09-10T08:30:00.000Z'
          },
          {
              chatId: 'team-chat',
              sender: 'Vasa',
              text: 'Všechno v pohodě, pracuji na nových funkcích',
              timestamp: '2023-09-10T08:32:00.000Z'
          }
      ]
  };
  
  chatRooms['chat-pepa'] = {
      id: 'chat-pepa',
      isGroup: false,
      participants: ['Sabrina', 'Pepa'],
      avatar: 'https://i.pravatar.cc/150?img=3',
      messages: [
          {
              chatId: 'chat-pepa',
              sender: 'Pepa',
              text: 'Ahoj Sabrino, můžeš mi pomoct s tím novým projektem?',
              timestamp: '2023-09-11T10:15:00.000Z'
          }
      ]
  };
  
  // Add new chat between Sabrina and 1234
  chatRooms['chat-1234'] = {
      id: 'chat-1234',
      isGroup: false,
      participants: ['Sabrina', '1234'],
      avatar: 'https://i.pravatar.cc/150?img=7',
      messages: [
          {
              chatId: 'chat-1234',
              sender: '1234',
              text: 'Ahoj Sabrino, kdy budeš mít čas na schůzku?',
              timestamp: '2023-09-15T13:45:00.000Z'
          },
          {
              chatId: 'chat-1234',
              sender: 'Sabrina',
              text: 'Ahoj, můžu zítra v 15:00. Vyhovuje ti to?',
              timestamp: '2023-09-15T13:50:00.000Z'
          }
      ]
  };
}

// Call this to initialize mock chats
initMockChats();

// Spuštění serveru
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server běží na http://localhost:${PORT}`));