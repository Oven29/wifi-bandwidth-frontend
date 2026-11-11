import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FilterState {
  search: string;
  maxTraffic: number;
}

const initialState: FilterState = {
  search: '',
  maxTraffic: 150,
};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setMaxTraffic: (state, action: PayloadAction<number>) => {
      state.maxTraffic = action.payload;
    },
    setFilters: (state, action: PayloadAction<{ search: string; maxTraffic: number }>) => {
      state.search = action.payload.search;
      state.maxTraffic = action.payload.maxTraffic;
    },
    resetFilters: (state) => {
      state.search = '';
      state.maxTraffic = 150;
    },
  },
});

export const { setSearch, setMaxTraffic, setFilters, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
