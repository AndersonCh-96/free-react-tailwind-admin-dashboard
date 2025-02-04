
import toast from "react-hot-toast"
import { postLogin } from "../../helpers/api_backend"
import { apiError, loginSuccess } from "./reducer"

export const loginUser = (user:any, navigate:any)=> async(dispatch:any)=>{

    try {
        
        const response= postLogin({
            email:user.email,
            password:user.password
        })
        const login= await response

        console.log("Login", login)

        if (login) {
            sessionStorage.setItem("authUser", JSON.stringify(login.data))
            let finalLogin= JSON.stringify(login.data)
            const {user}=JSON.parse(finalLogin)
            if (user.status==1) {
                dispatch(loginSuccess(user))
               navigate('/user')
                
            }
            
        }
        
    } catch (error:any) {
        toast.error(error.response.data)
        return error    
    }
}


export const logOutUser= ()=> async (dispatch:any)=>{
    try {
        sessionStorage.removeItem("authUser");
    } catch (error) {
        dispatch(apiError(error))
    }

}