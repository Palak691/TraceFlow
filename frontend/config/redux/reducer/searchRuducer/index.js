import { createSlice } from "@reduxjs/toolkit";
import { searchProject } from "../../action/searchAction";

const initialState = {
  results: { conversations: [], tasks: [], decisions: [] },
  isLoading: false,
  isError: false,
  message: ''
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    resetSearch: (state) => {
      state.results = { conversations: [], tasks: [], decisions: [] };
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProject.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(searchProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload.results;
      })
      .addCase(searchProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Search failed";
      })
  }
});

export const { resetSearch } = searchSlice.actions;
export default searchSlice.reducer;