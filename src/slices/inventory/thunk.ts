import { createAsyncThunk } from '@reduxjs/toolkit';
import { getInventory as getInventoryApi } from '../../helpers/api_backend';
import toast from 'react-hot-toast';

export const getInventory = createAsyncThunk('inventory/getAll', async () => {
  try {
    const { data } = await getInventoryApi();
    return data;
  } catch (error: any) {
    toast.error(error.message);
  }
});
