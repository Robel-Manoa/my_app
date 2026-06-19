// app.js - Version CommonJS
const express = require('express');
const app = express();

app.use(express.json());

// Base de données en mémoire
let users = [];

// Récupérer tous les utilisateurs
app.get('/users', (req, res) => {
  res.json(users);
});

// Ajouter un nouvel utilisateur
app.post('/users', (req, res) => {
  const user = req.body;
  users.push(user);
  res.status(201).json(user);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});