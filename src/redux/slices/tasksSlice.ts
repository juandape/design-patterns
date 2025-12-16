import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoAPIResponse {
  id: number;
  title: string;
  completed: boolean;
}

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const loadTasksFromLocalStorage = (): Task[] => {
  try {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error);
    return [];
  }
};

const initialState: TasksState = {
  tasks: loadTasksFromLocalStorage() || [],
  loading: false,
  error: null,
};

export const fetchTasksFromAPI = createAsyncThunk(
  'tasks/fetchFromAPI',
  async () => {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/todos?_limit=5'
    );
    const data = await response.json();
    return data.map((task: TodoAPIResponse) => ({
      id: task.id.toString(),
      title: task.title,
      completed: task.completed,
    }));
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    toggleTaskCompletion: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTasksFromAPI.pending, (state) => {
      state.loading = true;
      state.error = null;
      return state;
    });
    builder.addCase(fetchTasksFromAPI.fulfilled, (state, action) => {
      const newTasks: Task[] = action.payload.filter(
        (newTask: Task) =>
          !state.tasks.some((task: Task) => task.id === newTask.id)
      );
      state.loading = false;
      state.tasks.push(...newTasks);
    });
    builder.addCase(fetchTasksFromAPI.rejected, (state, action) => {
      console.log('Failed to fetch tasks from API:', action.error);
      state.loading = false;
      state.error = action.error.message || 'Error desconocido';
      return state;
    });
  },
});

export const { addTask, removeTask, toggleTaskCompletion } = tasksSlice.actions;
export default tasksSlice.reducer;
