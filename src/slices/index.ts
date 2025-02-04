import { combineReducers } from "@reduxjs/toolkit";
import UserSlice from "./users/reducer";

const rootReducer= combineReducers({

    User:UserSlice

})

export default rootReducer