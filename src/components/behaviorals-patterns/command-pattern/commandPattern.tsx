'use client';

import { useTaskManager } from './hooks/useTaskManager.hook';

export const CommandPattern = () => {
  const { addTask, removeTask, undo, redo, taskList } = useTaskManager();

  return (
    <div className='border mt-4 p-2 w-96 ml-5'>
      <h2>Command Pattern - Task Manager</h2>
      <ul>
        {taskList.map((task, id) => (
          <li key={task.id}>
            {id+1} - {task.text}
          </li>
        ))}
      </ul>
      <div className='flex gap-2'>
        <button
          onClick={addTask}
          className='border cursor-pointer bg-blue-500 text-white px-2 py-1 rounded'
        >
          Add Task
        </button>
        <button
          onClick={removeTask}
          className='border cursor-pointer bg-red-500 text-white px-2 py-1 rounded'
        >
          Remove Task
        </button>
        <button
          onClick={undo}
          className='border cursor-pointer bg-yellow-500 text-white px-2 py-1 rounded'
        >
          Undo
        </button>
        <button
          onClick={redo}
          className='border cursor-pointer bg-green-500 text-white px-2 py-1 rounded'
        >
          Redo
        </button>
      </div>
    </div>
  );
};
