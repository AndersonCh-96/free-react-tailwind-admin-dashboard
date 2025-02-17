import { createSlice } from '@reduxjs/toolkit';
import { createPurchase, getPurchase, getPurchaseDetails } from './thunk';

export const initialState: any = {
  purchaseList: [],
  purchaseDetails: {},
  error: {},
  loading: false,
};

const PurchaseSlice = createSlice({
  name: 'PurchaseSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //GetUser
    builder.addCase(getPurchase.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(getPurchase.fulfilled, (state: any, action: any) => {
      state.purchaseList = action.payload;
      state.loading = false;
    });

    builder.addCase(getPurchase.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });
    //GetOnePurchases
    builder.addCase(getPurchaseDetails.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(getPurchaseDetails.fulfilled, (state: any, action: any) => {
      state.purchaseDetails = action.payload;
      state.loading = false;
    });

    builder.addCase(getPurchaseDetails.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });

    //Create User
    builder.addCase(createPurchase.pending, (state: any, action: any) => {
      state.loading = true;
    });

    builder.addCase(createPurchase.fulfilled, (state: any, action: any) => {
      console.log('Data', action.meta.arg);
      state.purchaseList = [...state.purchaseList, action.meta.arg];
      state.loading = false;
    });

    builder.addCase(createPurchase.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.loading = false;
    });
    //UpdateUser

    //   builder.addCase(editUserData.pending, (state: any, action: any) => {
    //     state.loading = true;
    //   });

    //   builder.addCase(editUserData.fulfilled, (state: any, action: any) => {
    //     state.userList = state.userList.map((item: any) =>
    //       item.id === action.meta.arg.id
    //         ? { ...state.userList, ...action.meta.arg }
    //         : item,
    //     );
    //     state.loading = false;
    //   });

    //   builder.addCase(editUserData.rejected, (state: any, action: any) => {
    //     state.error = action.payload.error || null;
    //     state.loading = false;
    //   });

    //   //Delete User
    //   builder.addCase(deleteUserData.pending, (state: any, action: any) => {
    //     state.loading = true;
    //   });

    //   builder.addCase(deleteUserData.fulfilled, (state: any, action: any) => {

    //     state.userList = state.userList.filter(
    //       (item: any) => item.id !== action.meta.arg,
    //     );
    //     state.loading = false;
    //   });

    //   builder.addCase(deleteUserData.rejected, (state: any, action: any) => {
    //     state.error = action.payload.error || null;
    //     state.loading = false;
    //   });
  },
});

export default PurchaseSlice.reducer;
