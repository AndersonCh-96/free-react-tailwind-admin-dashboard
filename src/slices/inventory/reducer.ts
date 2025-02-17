import { createSlice } from '@reduxjs/toolkit';
import { getInventory } from './thunk';

const initialState = {
  inventoryList: [],
  error: {},
  loading: false,
};

const InventorySlice = createSlice({
  name: 'InventorySlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getInventory.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(getInventory.fulfilled, (state: any, action: any) => {
      state.inventoryList = action.payload;
      state.loading = false;
    });

    builder.addCase(getInventory.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });
  },
});

export default InventorySlice.reducer;
