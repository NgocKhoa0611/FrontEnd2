import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: {
        cart: {
            cartDetail: [],
        },
    },
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addCartDetail: (state, action) => {
            const newItem = action.payload;

            const existingItem = state.items.cart.cartDetail.find(
                (item) => item.product_detail_id === newItem.product_detail_id
            );

            if (existingItem) {
                existingItem.quantity += newItem.quantity;
            } else {
                state.items.cart.cartDetail.push(newItem);
            }
        },
        updateItemQuantity(state, action) {
            state.totalQuantity = action.payload.totalQuantity;
            state.totalPrice = action.payload.totalPrice;
        },
        removeItemFromCart: (state, action) => {
            const productId = action.payload;
            state.items = state.items.filter((item) => item.product_detail_id !== productId);
        },
        clearCart: (state) => {
            state.items = [];
            state.cartCount = 0;  // Reset cartCount khi giỏ hàng bị xóa
        },
        updateCartDetail: (state, action) => {
            state.items.cart.cartDetail = action.payload;
        },
        setCartItems: (state, action) => {
            state.items = action.payload;
        },
    },
});

export const { setCartItems, addCartDetail, updateItemQuantity, removeItemFromCart, clearCart, updateCartDetail } = cartSlice.actions;

export default cartSlice;
