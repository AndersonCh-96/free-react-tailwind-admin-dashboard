import { createSlice } from '@reduxjs/toolkit';
import { createProvider, getProviders } from './thunk';

export const initialState: any = {
  providerList: [],
  errro: {},
  loading: false,
};

const ProviderSlice = createSlice({
  name: 'ProviderSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {

     //GetProvider
        builder.addCase(getProviders.pending, (state: any, action: any) => {
          state.loading = true;
        });
    
        builder.addCase(getProviders.fulfilled, (state: any, action: any) => {
          state.providerList = action.payload;
          state.loading = false;
        });
    
        builder.addCase(getProviders.rejected, (state: any, action: any) => {
          state.error = action.payload.error || null;
          state.loading = false;
        });

         //Create Provider
            builder.addCase(createProvider.pending, (state: any, action: any) => {
              state.loading = true;
            });
        
            builder.addCase(createProvider.fulfilled, (state: any, action: any) => {
              console.log('Data', action.meta.arg);
              state.providerList = [...state.providerList, action.meta.arg];
              state.loading = false;
            });
        
            builder.addCase(createProvider.rejected, (state: any, action: any) => {
              state.error = action.payload.error || null;
              state.loading = false;
            });
  },
});



export default ProviderSlice.reducer