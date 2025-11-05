const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" } // autorise toutes les origines
});

// Vérification serveur
app.get("/", (req, res) => res.send("Babyphone serveur actif"));

// Relais audio
io.on("connection", (socket) => {
    console.log("Client connecté :", socket.id);

    // Quand bébé envoie audio
    socket.on("audio-stream", (data) => {
        // Envoyer aux autres clients (parents)
        socket.broadcast.emit("audio-stream", data);
    });

    socket.on("disconnect", () => {
        console.log("Client déconnecté :", socket.id);
    });
});

// Démarrage serveur
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Serveur Babyphone démarré sur port ${PORT}`));
