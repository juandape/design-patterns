'use client';

import { useAppSelector, useAppDispatch } from '../hooks';
import { removeTask, toggleTaskCompletion } from '../tasksSlice';
import { BsTrash } from 'react-icons/bs';

export const TasksList = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.tasks);
  const loading = useAppSelector((state) => state.tasks.loading);
  const error = useAppSelector((state) => state.tasks.error);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <ul className='text-black border-t mt-4'>
        {tasks &&
          Array.isArray(tasks) &&
          tasks.map((task) => (
            <li
              key={task.id}
              className='flex gap-2 border-b border-gray-300 py-2'
            >
              <input
                type='checkbox'
                checked={task.completed}
                onChange={() => dispatch(toggleTaskCompletion(task.id))}
                className='cursor-pointer w-4 h-4 accent-blue-500 my-auto'
              />
              <span
                className={`flex-1 cursor-pointer ${
                  task.completed ? 'line-through text-gray-500' : ''
                }`}
                onClick={() => dispatch(toggleTaskCompletion(task.id))}
              >
                {task.title}
              </span>
              <button
                onClick={() => dispatch(removeTask(task.id))}
                className='text-red-600 ml-auto'
              >
                <BsTrash />
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};
