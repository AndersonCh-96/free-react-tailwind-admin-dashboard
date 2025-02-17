import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getCredits as getCreditsApi,
  getCustomerCredits as getCustomerCteditsApi,
} from './../../helpers/api_backend';
import toast from 'react-hot-toast';

export const getCredits = createAsyncThunk('credits/getCredits', async () => {
  try {
    const { data } = await getCreditsApi();
    return data;
  } catch (error: any) {
    toast.error(error.message);
    return error;
  }
});

export const getCustomerCredits = createAsyncThunk(
  'credits/getCustomerCredits',
  async (customerId: string) => {
    try {
      const { data } = await getCustomerCteditsApi(customerId);
      return data;
    } catch (error: any) {
      toast.error(error.message);
      return error;
    }
  },
);
