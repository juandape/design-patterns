'use client';

import { setFilter, FilterType } from '../slices/filterSlice';
import { useAppSelector, useAppDispatch } from '../hooks';

export const TaskFilters = () => {
  const appSelector = useAppSelector((state) => state.filters.currentFilter);
  const dispatch = useAppDispatch();

  const handleFilter = (filter: FilterType) => {
    dispatch(setFilter(filter));
  };

  const buttonStyle =
    'rounded-full px-4 py-2 cursor-pointer transition-colors duration-300';

  return (
    <div className='flex gap-3 mt-4 justify-center'>
      <button
        onClick={() => handleFilter('all')}
        className={`${buttonStyle} ${
          appSelector === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }
        `}
      >
        All
      </button>
      <button
        onClick={() => handleFilter('completed')}
        className={`${buttonStyle} ${
          appSelector === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        Completed
      </button>
      <button
        onClick={() => handleFilter('pending')}
        className={`${buttonStyle} ${
          appSelector === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }
        `}
      >
        Pending
      </button>
    </div>
  );
};
