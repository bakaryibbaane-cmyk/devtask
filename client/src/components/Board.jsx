import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Column from "./Column";
import TaskModal from "./TaskModal";
import { getTasks, createTask, updateTask, deleteTask } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Board() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const data = await getTasks();
    if (Array.isArray(data)) {
      setTasks(data);
    }
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

async function handleStatusChange(id, newStatus) {
  await updateTask(id, { status: newStatus });
  loadTasks();
}

  function handleAddNew() {
    setEditingTask(null);
    setIsModalOpen(true);
  }

  function handleLogout() {
    logout();
    navigate("/login");
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
      <div className="flex gap-6 overflow-x-auto">
        <Column
          status="todo"
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
        <Column
          status="in_progress"
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
        <Column
          status="done"
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </div>
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSave}
        initialData={editingTask}
      />
    </div>
  );
}

export default Board;
