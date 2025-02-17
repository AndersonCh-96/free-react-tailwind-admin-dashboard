import { createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import {
  getProducts as getProductsApi,
  createProduct as createProductApi,
  updateProduct as updateProductApi,
  deleteProduct as deleteProductApi,
} from '../../helpers/api_backend';

export const getAllProducts = createAsyncThunk(
  'products/getProducts',
  async () => {
    try {
      const { data } = await getProductsApi();
      return data;
    } catch (error: any) {
      toast.error(error.message);
      return error;
    }
  },
);

export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (product: any) => {
    try {
      const resp = await createProductApi(product);
      toast.success('Producto creado con exito');
      return resp;
    } catch (error: any) {
      toast.error(error.message);
      return error;
    }
  },
);

export const updateProduct = createAsyncThunk(
  'product/ updateProduct',
  async (product: any) => {
    try {
      const resp = await updateProductApi(product);
      toast.success('Producto actualizado con exito');
      return resp;
    } catch (error: any) {
      toast.error(error.message);
      return error;
    }
  },
);

export const deleteProduct = createAsyncThunk(
  'product/updateProduct',
  async (id: string) => {
    try {
      const resp = await deleteProductApi(id);
      toast.success('Producto se elimino con exito');
      return resp;
    } catch (error: any) {
      toast.error(error.message);
      return error;
    }
  },
);
