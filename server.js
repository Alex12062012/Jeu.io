const express = require("express");
const path = require("path");

const app = express();

// Port imposé par Render ou fallback local
const PORT = process.env.PORT || 3000;

// Dossier public (site statique)
app.use(express.static(path.join(__dirname, "public")));

// Route principale
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
