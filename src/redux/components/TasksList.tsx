'use client';

import { useAppSelector, useAppDispatch } from '../hooks';
import { removeTask, toggleTaskCompletion } from '../tasksSlice';

export const TasksList = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks);

  return (
    <ul className='text-black border-t mt-4'>
      {tasks.map((task) => (
        <li key={task.id} className='flex'>
          <span
            style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
            onClick={() => dispatch(toggleTaskCompletion(task.id))}
            className='cursor-pointer'
          >
            {task.title}
          </span>
          <button
            onClick={() => dispatch(removeTask(task.id))}
            className='text-red-600 ml-auto'
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
};
