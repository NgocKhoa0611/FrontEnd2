import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import cartSlice from './slices/cartslice';
import orderSlice from './slices/orderslice';

const rootReducer = combineReducers({
    cart: cartSlice.reducer,
    order: orderSlice.reducer,
});

export const store = configureStore({
    reducer: rootReducer,
});

