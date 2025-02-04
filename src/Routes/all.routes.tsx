import { Navigate } from "react-router-dom";
import SignIn from "../pages/Authentication/SignIn";
import SignUp from "../pages/Authentication/SignUp";
import Calendar from "../pages/Calendar";
import Chart from "../pages/Chart";
import ECommerce from "../pages/Dashboard/ECommerce";
import FormElements from "../pages/Form/FormElements";
import FormLayout from "../pages/Form/FormLayout";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import Tables from "../pages/Tables";
import Alerts from "../pages/UiElements/Alerts";
import Buttons from "../pages/UiElements/Buttons";
import User from "../pages/User/User";

const authRoutes= [
    {
        path:"/", title:"Ecomerce",component:<ECommerce/> 
    },
    
    {
        path:"/user",title:"Usuarios", component: <User/>
    },
    {
        path:"/calendar", component: <Calendar/>
    },
    {
        path:"/profile", component: <Profile/>
    },
    {
        path:"/forms/form-elements", component: <FormElements/>
    },
    {
        path:"/forms/form-layout", component: <FormLayout/>
    },
    {
        path:"/tables", component: <Tables/>
    },
    {
        path:"/settings", component: <Settings/>
    },
    {
        path:"/chart", component: <Chart/>
    },
    {
        path:"/ui/alerts", component: <Alerts/>
    },
    {
        path:"/ui/buttons", component: <Buttons/>
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