import { User } from "../pages/User/interface.use";
import { APIClient } from "./api.helper"
import * as url from "./url";

const api = new APIClient()


//Login

export const postLogin = (data:any) => api.create(url.POST_LOGIN,data)
export const postLogOut=(data:any)=>api.create(url.POST_LOGOUT,data)


//Users
export const getUsers= () => api.get(url.GET_USERS)
export const editUser = (user:User) => api.put(`${url.GET_USERS}/${user.id}`, user)
export const createUser = (user:any) => api.create(`${url.GET_USERS}`, user) 
export const deleteUser = (id:any) => api.delete(`${url.GET_USERS}/${id}`)