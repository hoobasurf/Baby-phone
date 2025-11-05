const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: "*" }
});

io.on("connection", socket => {
  console.log("Nouvelle connexion:", socket.id);

  socket.on("offer", data => io.to(data.target).emit("offer", { sdp: data.sdp, from: socket.id }));
  socket.on("answer", data => io.to(data.target).emit("answer", { sdp: data.sdp }));
  socket.on("ice-candidate", data => io.to(data.target).emit("ice-candidate", { candidate: data.candidate }));
  socket.on("join", room => { socket.join(room); io.to(room).emit("user-joined", socket.id); });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server démarré sur port ${PORT}`));
