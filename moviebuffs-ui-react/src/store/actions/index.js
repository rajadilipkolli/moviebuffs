import { fetchAllGenres, fetchProductById, fetchProducts } from "./products";
import { addProductToCart, fetchOrderById, placeOrder, clearCart } from "./cart";
import { login } from "./user";

export {
    login,
    fetchProducts, fetchProductById, fetchAllGenres,
    addProductToCart, placeOrder, fetchOrderById, clearCart
};
