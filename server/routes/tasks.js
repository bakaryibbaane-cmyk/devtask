const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// GET /api/tasks -> récupère toutes les tâches
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// POST /api/tasks -> crée une nouvelle tâche
router.post("/", async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Le titre est obligatoire" });
    }

    const newTask = new Task({ title, description, status, priority });
    const savedTask = await newTask.save();

    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// PUT /api/tasks/:id -> modifie une tâche existante
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      return res.status(404).json({ message: "Tâche introuvable" });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// DELETE /api/tasks/:id -> supprime une tâche
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Tâche introuvable" });
    }

    res.json({ message: "Tâche supprimée", task: deletedTask });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;