import { createAsyncThunk } from '@reduxjs/toolkit';
import { getCustomers as getCustomersApi, createCustomer as createCustomersApi } from '../../helpers/api_backend';
import toast from 'react-hot-toast';

export const getCustomers = createAsyncThunk(
  'customers/getCustomers',
  async () => {
    try {
      const { data } = await getCustomersApi();
      return data;
    } catch (error) {
      return error;
    }
  },
);

export const createCustomer = createAsyncThunk(
    'customer/createCustomer',
    async (customer: any) => {
      try {
        const resp = await createCustomersApi(customer);
        toast.success('Cliente creado con exito');
        return resp;
      } catch (error: any) {
        toast.error(error.message);
        return error;
      }
    },
  );