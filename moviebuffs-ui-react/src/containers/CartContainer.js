import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import * as actions from "../store/actions/index";

const CartContainer = () => {
  const cart = useSelector(state => state.cart.cart);
  const dispatch = useDispatch();
  
  const [order, setOrder] = useState({
    customerName: "",
    customerEmail: "",
    deliveryAddress: "",
    creditCardNumber: "",
    cvv: ""
  });

  const cartTotalAmount = () => {
    return cart.reduce((accumulator, item) => 
      accumulator + (item.product.price * item.quantity), 0.0);
  };

  const cartItems = () => {
    return cart.map(item => (
      <tr key={item.product.id}>
        <td>{item.product.title}</td>
        <td>${item.product.price}</td>
        <td>{item.quantity}</td>
        <td>${item.product.price * item.quantity}</td>
      </tr>
    ));
  };

  const handleInputChange = event => {
    const { name, value } = event.target;
    setOrder(prevOrder => ({
      ...prevOrder,
      [name]: value
    }));
  };

  const handlePlaceOrder = event => {
    event.preventDefault();
    const orderWithItems = {
      ...order,
      items: cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
    };
    dispatch(actions.placeOrder(orderWithItems));
  };

  const checkoutForm = () => {
    const isCartEmpty = cart.length === 0;
    if (isCartEmpty) {
      return (
        <div>
          <h2>Your cart is empty.</h2>
          <h3>
            <NavLink to="/">Continue Shopping...</NavLink>
          </h3>
        </div>
      );
    } else {
      return (
        <div className="row">
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header">Items in Cart</div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Movie</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems()}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th colSpan="3" className="text-end">Total:</th>
                        <th>${cartTotalAmount()}</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            {orderForm()}
          </div>
        </div>
      );
    }
  };

  const orderForm = () => {
    return (
      <div className="card">
        <div className="card-header">Checkout</div>
        <div className="card-body">
          <form onSubmit={handlePlaceOrder}>
            <div className="mb-3">
              <label htmlFor="customerName" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="customerName"
                name="customerName"
                value={order.customerName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="customerEmail" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="customerEmail"
                name="customerEmail"
                value={order.customerEmail}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="deliveryAddress" className="form-label">Delivery Address</label>
              <textarea
                className="form-control"
                id="deliveryAddress"
                name="deliveryAddress"
                value={order.deliveryAddress}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="creditCardNumber" className="form-label">Credit Card Number</label>
              <input
                type="text"
                className="form-control"
                id="creditCardNumber"
                name="creditCardNumber"
                value={order.creditCardNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="cvv" className="form-label">CVV</label>
              <input
                type="text"
                className="form-control"
                id="cvv"
                name="cvv"
                value={order.cvv}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Place Order
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <h2 className="my-4">Shopping Cart</h2>
      {checkoutForm()}
    </div>
  );
};

export default CartContainer;
