'use client';

import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchTasksFromAPI } from '../slices/tasksSlice';

export const FetchTasks = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.tasks.loading);
  const error = useAppSelector((state) => state.tasks.error);

  const handleFetch = () => {
    dispatch(fetchTasksFromAPI());
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <button
        onClick={handleFetch}
        className='border rounded-full bg-red-500 p-2 mx-auto block mt-2 text-white'
      >
        Load Tasks from API
      </button>
    </div>
  );
};
