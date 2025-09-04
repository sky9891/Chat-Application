const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const colors = require("colors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// ---------------- CORS ----------------
app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true, // allows cookies/auth headers
  })
);

// ---------------- API Routes ----------------
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// ---------------- Deployment ----------------
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// ---------------- Error Handling Middlewares ----------------
app.use(notFound);
app.use(errorHandler);

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () =>
  console.log(`🚀 Server running on PORT ${PORT}...`.yellow.bold)
);

// ---------------- Socket.io ----------------
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("⚡ Connected to socket.io".cyan.bold);

  // Store user data on socket
  socket.on("setup", (userData) => {
    socket.userData = userData;
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`📥 User joined room: ${room}`.green);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("❌ USER DISCONNECTED".red.bold);
    socket.leave(socket.userData?._id);
  });
});
