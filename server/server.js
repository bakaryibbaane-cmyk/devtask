require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/tasks");

const app = express();

// Connexion à MongoDB
connectDB();

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Route de test rapide
app.get("/", (req, res) => {
  res.json({ message: "API DevTask opérationnelle 🚀" });
});

// Routes des tâches
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});