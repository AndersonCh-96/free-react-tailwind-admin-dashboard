import { createSlice } from '@reduxjs/toolkit';
import { getCredits, getCustomerCredits } from './thunk';

const initialState = {
  creditsList: [],
  creditCustomer: {},
  error: {},
  loading: false,
};

const CreditSlice = createSlice({
  name: 'CreditSlice',
  reducers: {},
  initialState,
  extraReducers: (builder) => {
    //Get Credits
    builder.addCase(getCredits.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(getCredits.fulfilled, (state: any, action: any) => {
      state.creditsList = action.payload;
      state.loading = false;
    });

    builder.addCase(getCredits.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });

    //GEtCustomerCredits

    builder.addCase(getCustomerCredits.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(getCustomerCredits.fulfilled, (state: any, action: any) => {
      state.creditCustomer = action.payload;
      state.loading = false;
    });

    builder.addCase(getCustomerCredits.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });
  },
});

export default CreditSlice.reducer;
