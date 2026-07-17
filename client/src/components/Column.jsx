import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

const statusLabels = {
  todo: "À faire",
  in_progress: "En cours",
  done: "Terminé",
};

function Column({ status, tasks, onEdit, onDelete, onStatusChange }) {
  const filteredTasks = tasks.filter((task) => task.status === status);

  return (
    <div className="bg-gray-50 rounded-xl p-4 flex-1 min-w-[280px]">
      <h2 className="font-semibold text-gray-700 mb-4 flex items-center justify-between">
        {statusLabels[status]}
        <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-2 py-1">
          {filteredTasks.length}
        </span>
      </h2>
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[100px] rounded-lg transition-colors ${
              snapshot.isDraggingOver ? "bg-blue-50" : ""
            }`}
          >
            {filteredTasks.map((task, index) => (
              <TaskCard
                key={task._id}
                task={task}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default Column;