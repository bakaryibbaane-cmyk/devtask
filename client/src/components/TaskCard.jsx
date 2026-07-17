const priorityColors = {
  low: "bg-green-100 text-green-700 border-green-300",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
  high: "bg-red-100 text-red-700 border-red-300",
};

const statusNext = {
  todo: { label: "→ En cours", next: "in_progress" },
  in_progress: { label: "→ Terminé", next: "done" },
  done: { label: "↩ À faire", next: "todo" },
};

function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const nextStatus = statusNext[task.status];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800 text-sm">{task.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-gray-500 text-xs mb-3">{task.description}</p>
      )}

      {/* Bouton changement de statut rapide */}
      <button
        onClick={() => onStatusChange(task._id, nextStatus.next)}
        className="w-full text-xs text-blue-600 border border-blue-200 rounded-md py-1 mb-2 hover:bg-blue-50 transition-colors"
      >
        {nextStatus.label}
      </button>

      <div className="flex gap-2 justify-end">
        <button
          onClick={() => onEdit(task)}
          className="text-xs text-gray-500 hover:text-blue-600"
        >
          ✏️ Modifier
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="text-xs text-gray-500 hover:text-red-600"
        >
          🗑️ Supprimer
        </button>
      </div>
    </div>
  );
}

export default TaskCard;