import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedItems: [],
    totalPrice: 0
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setSelectedItems: (state, action) => {
            state.selectedItems = action.payload;
            state.totalPrice = action.payload.reduce((total, item) => total + item.price * item.quantity, 0)
        },
        clearSelectedItems: (state) => {
            state.selectedItems = [];
            state.totalPrice = 0;
        },
    },
});

export const { setSelectedItems, clearSelectedItems } = orderSlice.actions;

export default orderSlice;
