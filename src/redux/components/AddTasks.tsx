'use client';

import { useAppDispatch } from '../hooks';
import { useState } from 'react';
import { addTask } from '../tasksSlice';

export const AddTasks = () => {
  const [taskTitle, setTaskTitle] = useState('');
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      dispatch(
        addTask({
          id: Date.now().toString(),
          title: taskTitle,
          completed: false,
        })
      );
      setTaskTitle('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
    >
      <input
        type='text'
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        placeholder='Add a new task'
        className='border border-gray-300 rounded px-3 py-2 w-full text-black mt-4'
      />
      <button type='submit' className="rounded-full bg-blue-500 text-white px-4 py-2 mt-4 mx-auto block">Add Task</button>
    </form>
  );
};
