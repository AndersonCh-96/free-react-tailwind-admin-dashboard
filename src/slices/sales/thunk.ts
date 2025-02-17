import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getSales as getSalesApi,
  createSale as createSaleApi,
  getDetailSale as getDetailSaleApi,
} from './../../helpers/api_backend';
import toast from 'react-hot-toast';

export const getSales = createAsyncThunk('sales/getSales', async () => {
  try {
    const { data } = await getSalesApi();
    return data;
  } catch (error: any) {
    toast.error(error.message);
    return error;
  }
});

export const getDetailSale = createAsyncThunk(
  'sales/getDetailSale',
  async (id: any) => {
    try {
      const { data } = await getDetailSaleApi(id);
      console.log("Data", data)
      return data;
    } catch (error: any) {
      toast.error(error.message);
      return error;
    }
  },
);

export const createSale = createAsyncThunk(
  'sales/createSale',
  async (sale: any) => {
    try {
      const resp = await createSaleApi(sale);
      toast.success('Venta realizada');
      return resp;
    } catch (error: any) {
      toast.error(error.response.data);
      return error;
    }
  },
);
