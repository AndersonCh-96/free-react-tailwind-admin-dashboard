import { combineReducers } from '@reduxjs/toolkit';
import UserSlice from './users/reducer';
import ProductSlice from './products/reducer';
import CustomerSlice from './customers/reducer';
import ProviderSlice from './providers/reducer';
import PurchaseSlice from './purchase/reducer';
import InventorySlice from './inventory/reducer';
import SaleSlice from './sales/reducer';
import CreditSlice from './credits/reducer';
import PaymentSlice from './payment/reducer';

const rootReducer = combineReducers({
  User: UserSlice,
  Products: ProductSlice,
  Customers: CustomerSlice,
  Providers: ProviderSlice,
  Purchases: PurchaseSlice,
  Inventories: InventorySlice,
  Sales: SaleSlice,
  Credits: CreditSlice,
  Payment: PaymentSlice,
});

export default rootReducer;
