import { User } from '../pages/User/interface.use';
import { APIClient } from './api.helper';
import * as url from './url';

const api = new APIClient();

//Login

export const postLogin = (data: any) => api.create(url.POST_LOGIN, data);
export const postLogOut = (data: any) => api.create(url.POST_LOGOUT, data);

//Users
export const getUsers = () => api.get(url.GET_USERS);
export const editUser = (user: User) =>api.put(`${url.GET_USERS}/${user.id}`, user);
export const createUser = (user: any) => api.create(`${url.GET_USERS}`, user);
export const deleteUser = (id: any) => api.delete(`${url.GET_USERS}/${id}`);

//Products
export const getProducts = () => api.get(url.PRODUCT);
export const createProduct = (product: any) => api.create(`${url.PRODUCT}/create`, product);
export const updateProduct = (product: any) => api.update(`${url.PRODUCT}/${product.id}`, product);
export const deleteProduct= (id:any)=> api.delete(`${url.PRODUCT}/${id}`)


//Customers
export const getCustomers = ()=> api.get(url.CUSTOMER)
export const createCustomer= (customer:any) => api.create(url.CUSTOMER,customer)

//Providers
export const getProviders = ()=> api.get(url.PROVIDER)
export const createProvider= (provider:any) => api.create(url.PROVIDER,provider)