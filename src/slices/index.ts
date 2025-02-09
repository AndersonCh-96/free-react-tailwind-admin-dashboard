import { combineReducers } from "@reduxjs/toolkit";
import UserSlice from "./users/reducer";
import ProductSlice from "./products/reducer"
import CustomerSlice from "./customers/reducer"
import ProviderSlice from "./providers/reducer"

const rootReducer= combineReducers({

    User:UserSlice,
    Products:ProductSlice,
    Customers:CustomerSlice,
    Providers:ProviderSlice

})

export default rootReducer