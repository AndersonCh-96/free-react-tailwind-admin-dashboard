import { Navigate } from "react-router-dom";
import SignIn from "../pages/Authentication/SignIn";
import SignUp from "../pages/Authentication/SignUp";
import ECommerce from "../pages/Dashboard/ECommerce";
import User from "../pages/User/User";
import Product from "../pages/products/Product";
import Provider from "../pages/Provider/Provider";
import Customer from "../pages/Customer/Custromer";

const authRoutes= [
    {
        path:"/", title:"Ecomerce",component:<ECommerce/> 
    },
    
    {
        path:"/user",title:"Usuarios", component: <User/>
    },
    {
        path:"/products",title:"Productos", component: <Product/>
    },
    {
        path:"/providers",title:"Proveedores", component: <Provider/>
    },
    {
        path:"/customers",title:"Clientes", component: <Customer/>
    },
   
   
   
    {
        path: "/",
        exact: true,
        component: <Navigate to="/"/>,
    },
    {path: "*", component: <Navigate to="/"/>},
   
    
]

const publicRoutes=[
    {
        path:"/auth/signin", component: <SignIn/>
    },
    {
        path:"/auth/signup", component: <SignUp/>
    }
]


export {authRoutes,publicRoutes};