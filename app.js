const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");
const app = express();

const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public"))); // Corrected middleware setup

app.get("/", function (req, res) {
  res.render("index");
});

io.on("connection", function (socket) {
  console.log("a user connected");

  socket.on("send-location", (data) => {
    io.emit("recieve-location", { id: socket.id, ...data });
  });

  socket.on("disconnect", () => {
    io.emit("user-disconnected", socket.id);
  });
});

server.listen(process.env.PORT || 3000, (err) => {
  if (err) {
    console.error("Error listening on port 3000:", err);
  } else {
    console.log("Server listening on port 3000");
  }
});