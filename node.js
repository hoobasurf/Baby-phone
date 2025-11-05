const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" } // autorise toutes les origines pour Netlify
});

// Vérification serveur
app.get("/", (req, res) => res.send("Babyphone serveur actif"));

// Stocke temporairement les blobs audio
io.on("connection", (socket) => {
    console.log("Client connecté :", socket.id);

    // Quand le bébé envoie un blob audio
    socket.on("audio-stream", (data) => {
        // Renvoie à tous les autres clients (parents)
        socket.broadcast.emit("audio-stream", data);
    });

    socket.on("disconnect", () => {
        console.log("Client déconnecté :", socket.id);
    });
});

// Démarrage serveur
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Serveur Babyphone démarré sur port ${PORT}`));
