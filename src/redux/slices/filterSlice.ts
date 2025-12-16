import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type FilterType = 'all' | 'completed' | 'pending';

export interface FilterState {
  currentFilter: FilterType;
}

const initialState: FilterState = {
  currentFilter: 'all',
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<FilterType>) => {
      state.currentFilter = action.payload;
    },
  },
});

export const { setFilter } = filterSlice.actions;
export default filterSlice.reducer;
