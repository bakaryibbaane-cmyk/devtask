const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

// GET /api/tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// POST /api/tasks
router.post("/", async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;
    if (!title) return res.status(400).json({ message: "Le titre est obligatoire" });

    const newTask = new Task({ title, description, status, priority, userId: req.userId });
    const savedTask = await newTask.save();

    // Émettre l'événement à tous les clients connectés
    const io = req.app.get("io");
    io.emit("task:created", savedTask);

    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// PUT /api/tasks/:id
router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTask) return res.status(404).json({ message: "Tâche introuvable" });

    // Émettre l'événement à tous les clients connectés
    const io = req.app.get("io");
    io.emit("task:updated", updatedTask);

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!deletedTask) return res.status(404).json({ message: "Tâche introuvable" });

    // Émettre l'événement à tous les clients connectés
    const io = req.app.get("io");
    io.emit("task:deleted", req.params.id);

    res.json({ message: "Tâche supprimée", task: deletedTask });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

module.exports = router;