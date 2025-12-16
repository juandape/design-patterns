import { AddTasks } from '@/src/redux/components/AddTasks';
import { FetchTasks } from '@/src/redux/components/FetchTasks';
import { TaskFilters } from '@/src/redux/components/TaskFilters';
import { TasksList } from '@/src/redux/components/TasksList';

export default function ReduxPage() {
  return (
    <div className='p-5 mt-5 w-1/2 bg-white text-black mx-auto'>
      <h1>Redux Toolkit Example Tasks</h1>
      <AddTasks />
      <FetchTasks />
      <TaskFilters />
      <TasksList />
    </div>
  );
}
