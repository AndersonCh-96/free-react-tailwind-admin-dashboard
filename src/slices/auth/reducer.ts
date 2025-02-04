
import { createSlice } from "@reduxjs/toolkit"

export const initialState:any={
 user:{},
 error:'',
 loading:false,
 isUserLogout:false,
 errorMsg:false,
}

const AuthSlice= createSlice({
    name:'AuthSlice',
    initialState,
    reducers:{
        apiError(state, action) {
            state.error = action.payload.data;
            state.loading = true;
            state.isUserLogout = false;
            state.errorMsg = true;
          },
          loginSuccess(state, action) {
            state.user = action.payload
            state.loading = false;
            state.errorMsg = false;
          },
          logoutUserSuccess(state, action) {
            state.isUserLogout = true
          },
          reset_login_flag(state) {
            state.error = "";
            state.loading = false;
            state.errorMsg = false;
          }
        
    },
 
})

export const {
    apiError,
    loginSuccess,
    logoutUserSuccess,
    reset_login_flag
  } = AuthSlice.actions

export default AuthSlice.reducer;