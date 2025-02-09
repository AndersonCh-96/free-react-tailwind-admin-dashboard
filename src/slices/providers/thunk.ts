import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getProviders as getProvidersApi,
  createProvider as createProviderApi,
} from './../../helpers/api_backend';
import toast from 'react-hot-toast';

export const getProviders = createAsyncThunk(
  'provider/getProviders',
  async () => {
    try {
      const { data } = await getProvidersApi();
      return data;
    } catch (error) {
      return error;
    }
  },
);

export const createProvider = createAsyncThunk(
  'provider/createProvider',
  async (user: any) => {
    try {
      const resp = await createProviderApi(user);
      toast.success('Proveedor creado con exito');
      return resp;
    } catch (error: any) {
      toast.error(error.message);
      return error;
    }
  },
);
