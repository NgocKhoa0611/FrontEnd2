import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { updateCartDetail, removeItemFromCart, setCartItems } from '../../../../redux/slices/cartslice';
import { setSelectedItems } from '../../../../redux/slices/orderslice';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast, Toaster } from 'react-hot-toast';
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../../../../configs/varibles";

const Cart = () => {
  const [cart, setCart] = useState({ cartDetail: [] });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const totalPrice = useSelector((state) => state.order.totalPrice);
  const voucher = 0;
  const reduxSelectedProducts = useSelector((state) => state.order.selectedItems);

  useEffect(() => {
    setSelectedProducts(reduxSelectedProducts || []);
  }, [reduxSelectedProducts]);

  useEffect(() => {
    const getCart = async () => {
      try {
        const response = await axios.get(`${API_URL}/cart`, {
          withCredentials: true,
        });
        setCart(response.data.cart || { cartDetail: [] });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart:', error.response?.data?.message || error.message);
        setLoading(false);
      }
    };
    getCart();
  }, []);

  const handleCheckboxChange = (cartDetail) => {
    setSelectedProducts((prevSelected) => {
      const isAlreadySelected = prevSelected.some(
        (product) => product.cart_detail_id === cartDetail.cart_detail_id
      );

      const updatedSelectedProducts = isAlreadySelected
        ? prevSelected.filter(
          (product) => product.cart_detail_id !== cartDetail.cart_detail_id
        )
        : [
          ...prevSelected,
          {
            cart_detail_id: cartDetail.cart_detail_id,
            product_detail_id: cartDetail.product_detail_id,
            product_name: cartDetail.ProductDetail?.product?.product_name || '',
            price: cartDetail.ProductDetail?.product?.price || 0,
            quantity: cartDetail.quantity || 1,
            size: cartDetail.ProductDetail?.size?.size_name,
            color: cartDetail.ProductDetail?.color?.color_name,
            img_url: cartDetail.ProductDetail?.productImage?.img_url || '',
          },
        ];

      dispatch(setSelectedItems(updatedSelectedProducts));
      return updatedSelectedProducts;
    });
  };

  const handleSelectAll = () => {
    const isAllSelected = cart.cartDetail.length > 0 &&
      selectedProducts.length === cart.cartDetail.length;

    const updatedSelectedProducts = isAllSelected
      ? []
      : cart.cartDetail.map((cartDetail) => ({
        cart_detail_id: cartDetail.cart_detail_id,
        product_detail_id: cartDetail.product_detail_id,
        product_name: cartDetail.ProductDetail?.product?.product_name || '',
        price: cartDetail.ProductDetail?.product?.price || 0,
        quantity: cartDetail.quantity || 1,
        size: cartDetail.ProductDetail?.size?.size_name || '',
        color: cartDetail.ProductDetail?.color?.color_name || '',
        img_url: cartDetail.ProductDetail?.productImage?.img_url || '',
      }));

    setSelectedProducts(updatedSelectedProducts);
    dispatch(setSelectedItems(updatedSelectedProducts));
  };

  const handleQuantityChange = async (product_detail_id, action) => {
    try {
      const endpoint = action === 'increase' ? 'increase' : 'decrease';
      await axios.put(
        `${API_URL}/cart/${endpoint}`,
        { product_detail_id },
        { withCredentials: true }
      );

      const updatedCart = {
        cartDetail: cart.cartDetail.map((item) => {
          if (item.ProductDetail.product_detail_id === product_detail_id) {
            const newQuantity = action === 'increase'
              ? item.quantity + 1
              : Math.max(1, item.quantity - 1);
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
      };

      setCart(updatedCart);

      const updatedSelectedProducts = selectedProducts.map((product) =>
        product.product_detail_id === product_detail_id
          ? { ...product, quantity: action === 'increase' ? product.quantity + 1 : Math.max(1, product.quantity - 1) }
          : product
      );

      dispatch(setSelectedItems(updatedSelectedProducts));
      setSelectedProducts(updatedSelectedProducts);

    } catch (error) {
      console.error(`Error ${action}ing quantity:`, error);
    }
  };

  const handleRemove = async (product_detail_id) => {
    try {
      // Perform the delete operation
      await axios.delete(`${API_URL}/cart/${product_detail_id}`, {
        data: { product_detail_id },
        withCredentials: true,
      });

      // Update the cart after removing the item
      const updatedCart = {
        cartDetail: cart.cartDetail.filter(
          (item) => item.ProductDetail.product_detail_id !== product_detail_id
        )
      };

      setCart(updatedCart);
      dispatch(updateCartDetail(updatedCart.cartDetail));

      const updatedSelectedProducts = selectedProducts.filter(
        (product) => product.product_detail_id !== product_detail_id
      );
      setSelectedProducts(updatedSelectedProducts);
      dispatch(setSelectedItems(updatedSelectedProducts));
      toast.success("Sản phẩm đã được xóa khỏi giỏ hàng!", {
        autoClose: 3000,
      });
    } catch (error) {
      // Show error toast
      toast.dismiss(confirmToast); // Dismiss the loading toast
      toast.error("Lỗi khi xóa sản phẩm!", {  
        autoClose: 3000,
      });
      console.error('Error removing item:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-700">Giỏ hàng</h1>

        {cart.cartDetail.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600 mb-4">Giỏ hàng của bạn đang trống</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Items */}
            <div className="lg:w-3/4">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Desktop Table */}
                <table className="w-full hidden md:table">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-4 text-left w-fit text-center">
                        <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={cart.cartDetail.length > 0 && selectedProducts.length === cart.cartDetail.length}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                      </th>
                      <th className="p-4 text-center font-semibold text-gray-600 w-[500px]">Sản phẩm</th>
                      <th className="p-4 text-center font-semibold text-gray-600">Số lượng</th>
                      <th className="p-4 text-center font-semibold text-gray-600">Tổng cộng</th>
                      <th className="p-4 text-center font-semibold text-gray-600">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.cartDetail.map((item) => (
                      <tr key={item.cart_detail_id} className="border-t">
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedProducts.some(
                              (product) => product.cart_detail_id === item.cart_detail_id
                            )}
                            onChange={() => handleCheckboxChange(item)}
                            className="w-4 h-4 rounded border-gray-300"
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center">
                            <img
                              src={`${API_URL}/img/${item.ProductDetail.productImage?.img_url}`}
                              alt={item.ProductDetail.product.product_name}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                            <div className="ml-4">
                              <h3 className="font-medium text-gray-900 text-left text-[15px]">{item.ProductDetail.product.product_name}</h3>
                              <p className="text-sm text-left text-gray-500">
                                {item.ProductDetail.color.color_name} - {item.ProductDetail.size.size_name}
                              </p>
                              <p className="text-left">
                                {item.ProductDetail.product.price.toLocaleString()}₫
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => handleQuantityChange(item.ProductDetail.product_detail_id, 'decrease')}
                              className="w-8 h-8 flex items-center justify-center border rounded-l hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="w-12 h-8 flex items-center justify-center border-t border-b">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.ProductDetail.product_detail_id, 'increase')}
                              className="w-8 h-8 flex items-center justify-center border rounded-r hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          {(item.ProductDetail.product.price * item.quantity).toLocaleString()}₫
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleRemove(item.ProductDetail.product_detail_id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Mobile List */}
                <div className="md:hidden divide-y">
                  {cart.cartDetail.map((item) => (
                    <div key={item.cart_detail_id} className="p-4">
                      <div className="flex items-start space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.some(
                            (product) => product.cart_detail_id === item.cart_detail_id
                          )}
                          onChange={() => handleCheckboxChange(item)}
                          className="mt-1 w-4 h-4 rounded border-gray-300 self-center "
                        />
                        <img
                          src={`${API_URL}/img/${item.ProductDetail.productImage?.img_url}`}
                          alt={item.ProductDetail.product.product_name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <div className="flex-1 pr-3">
                          <h3 className="font-medium text-gray-900">{item.ProductDetail.product.product_name}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.ProductDetail.color.color_name} - {item.ProductDetail.size.size_name}
                          </p>
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium text-gray-900 mt-2">
                              {item.ProductDetail.product.price.toLocaleString()}₫
                            </p>
                            <div className="flex items-center border rounded-lg">
                              <button
                                onClick={() => handleQuantityChange(item.ProductDetail.product_detail_id, 'decrease')}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                              >
                                -
                              </button>
                              <span className="w-12 h-8 flex items-center justify-center border-x">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.ProductDetail.product_detail_id, 'increase')}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between self-center">
                          <button
                            onClick={() => handleRemove(item.ProductDetail.product_detail_id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Chi tiết thanh toán</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính</span>
                    <span>{totalPrice.toLocaleString()}₫</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Voucher</span>
                    <span>{voucher.toLocaleString()}₫</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex justify-between font-semibold">
                      <span>Tổng cộng</span>
                      <span>{totalPrice.toLocaleString()}₫</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/checkout')}
                  disabled={selectedProducts.length === 0}
                  className={`w-full mt-6 py-3 rounded-lg text-white font-medium
                    ${selectedProducts.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#0f3460] hover:bg-[#072344]'}`}
                >
                  Thanh toán
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default Cart;