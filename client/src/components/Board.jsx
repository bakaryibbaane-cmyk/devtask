import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext } from "@hello-pangea/dnd";
import Column from "./Column";
import TaskModal from "./TaskModal";
import { getTasks, createTask, updateTask, deleteTask } from "../services/api";
import { useAuth } from "../context/AuthContext";
import socket from "../services/socket";

function Board() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { loadTasks(); }, []);

  useEffect(() => {
  socket.on("task:created", () => loadTasks());
  socket.on("task:updated", () => loadTasks());
  socket.on("task:deleted", () => loadTasks());

  return () => {
    socket.off("task:created");
    socket.off("task:updated");
    socket.off("task:deleted");
  };
  }, []);

  async function loadTasks() {
    const data = await getTasks();
    if (Array.isArray(data)) setTasks(data);
  }

  async function handleSave(taskData) {
    if (editingTask) {
      await updateTask(editingTask._id, taskData);
    } else {
      await createTask(taskData);
    }
    setIsModalOpen(false);
    setEditingTask(null);
    loadTasks();
  }

  async function handleDelete(id) {
    await deleteTask(id);
    loadTasks();
  }

  function handleEdit(task) {
    setEditingTask(task);
    setIsModalOpen(true);
  }

  function handleAddNew() {
    setEditingTask(null);
    setIsModalOpen(true);
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  async function handleStatusChange(id, newStatus) {
    await updateTask(id, { status: newStatus });
    loadTasks();
  }

  async function handleDragEnd(result) {
    const { destination, draggableId } = result;
    if (!destination) return;
    const newStatus = destination.droppableId;
    await updateTask(draggableId, { status: newStatus });
    loadTasks();
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">DevTask 📋</h1>
          {user && (
            <p className="text-sm text-gray-500 mt-1">
              Connecté en tant que {user.name}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAddNew}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700"
          >
            + Nouvelle tâche
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300"
          >
            Déconnexion
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto">
          <Column status="todo" tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} onStatusChange={handleStatusChange} />
          <Column status="in_progress" tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} onStatusChange={handleStatusChange} />
          <Column status="done" tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} onStatusChange={handleStatusChange} />
        </div>
      </DragDropContext>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
        onSave={handleSave}
        initialData={editingTask}
      />
    </div>
  );
}

export default Board;