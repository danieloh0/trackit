import React from 'react';
import { CheckCircle2, Circle, Clock, Tag } from 'lucide-react';

const TaskCard = ({ task, onComplete, onDelete }) => {
  const categoryColors = {
    'Work': 'bg-blue-100 text-blue-800',
    'Health': 'bg-green-100 text-green-800',
    'Learning': 'bg-purple-100 text-purple-800',
    'Personal': 'bg-yellow-100 text-yellow-800',
    'Social': 'bg-pink-100 text-pink-800'
  };

  const priorityColors = {
    'High': 'border-red-300 bg-red-50',
    'Medium': 'border-yellow-300 bg-yellow-50',
    'Low': 'border-green-300 bg-green-50'
  };

  return (
    <div className={`p-4 rounded-lg border-2 transition-all duration-200 ${
      task.completed 
        ? 'bg-green-50 border-green-200 opacity-75' 
        : priorityColors[task.priority] || 'border-gray-200 bg-white'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <button
            onClick={() => !task.completed && onComplete(task.id)}
            className={`flex-shrink-0 transition-colors ${
              task.completed 
                ? 'text-green-600 cursor-default' 
                : 'text-gray-400 hover:text-green-600 cursor-pointer'
            }`}
            disabled={task.completed}
          >
            {task.completed ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <Circle className="w-6 h-6" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3 className={`text-sm font-medium ${
              task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
            }`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={`text-sm mt-1 ${
                task.completed ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {task.description}
              </p>
            )}
            
            <div className="flex items-center space-x-3 mt-2">
              {task.category && (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  categoryColors[task.category] || 'bg-gray-100 text-gray-800'
                }`}>
                  <Tag className="w-3 h-3 mr-1" />
                  {task.category}
                </span>
              )}
              
              {task.estimatedMinutes && (
                <span className="inline-flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {task.estimatedMinutes} min
                </span>
              )}

              {task.points && (
                <span className="inline-flex items-center text-xs text-blue-600 font-medium">
                  +{task.points} pts
                </span>
              )}
            </div>
          </div>
        </div>

        {task.completed && (
          <div className="flex-shrink-0 ml-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ✅ Completed
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;