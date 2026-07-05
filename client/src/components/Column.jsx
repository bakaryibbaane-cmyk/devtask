import TaskCard from "./TaskCard";

const statusLabels = {
  todo: "À faire",
  in_progress: "En cours",
  done: "Terminé",
};

function Column({ status, tasks, onEdit, onDelete }) {
  const filteredTasks = tasks.filter((task) => task.status === status);

  return (
    <div className="bg-gray-50 rounded-xl p-4 flex-1 min-w-[280px]">
      <h2 className="font-semibold text-gray-700 mb-4 flex items-center justify-between">
        {statusLabels[status]}
        <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-2 py-1">
          {filteredTasks.length}
        </span>
      </h2>
      <div>
        {filteredTasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default Column;
