import { createSlice } from '@reduxjs/toolkit';
import { createCustomer, getCustomers } from './thunk';

export const initialState: any = {
  customerList: [],
  error: {},
  loading: false,
};

const CustomerSlice = createSlice({
  name: 'CustomerSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Get

    builder.addCase(getCustomers.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(getCustomers.fulfilled, (state: any, action: any) => {
      state.customerList = action.payload;
      state.loading = false;
    });

    builder.addCase(getCustomers.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });

    //Create
    builder.addCase(createCustomer.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(createCustomer.fulfilled, (state: any, action: any) => {
      state.customerList = [...state.customerList, action.meta.arg];
      state.loading = false;
    });

    builder.addCase(createCustomer.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });
  },
});

export default CustomerSlice.reducer;
