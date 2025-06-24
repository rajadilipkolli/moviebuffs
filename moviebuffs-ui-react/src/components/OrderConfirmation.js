import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as actions from "../store/actions/index";

const OrderConfirmation = () => {
    const [order, setOrder] = useState({ items: [] });
    const { orderId } = useParams();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const orderData = await actions.fetchOrderById(orderId);
                setOrder(orderData);
            } catch (error) {
                console.error("Failed to fetch order:", error);
            }
        };
        
        fetchOrder();
    }, [orderId]);

    const cartTotalAmount = () => {
        return order.items.reduce((accumulator, currentValue) => 
            accumulator + (currentValue.price * currentValue.quantity), 0.0);
    };

    const cartItems = () => {
        return order.items.map(item => (
            <tr key={item.productId}>
                <td>{item.title}</td>
                <td>${item.price}</td>
                <td>{item.quantity}</td>
                <td>${item.price * item.quantity}</td>
            </tr>
        ));
    };

    return (
        <div className="container">
            <h2 className="my-4">Order Confirmation</h2>
            <div className="alert alert-success">
                <h4>Thank you for your order!</h4>
                <p>Your order has been received. Order ID: {orderId}</p>
            </div>
            
            <div className="row">
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-header">Order Details</div>
                        <div className="card-body">
                            <p><strong>Customer Name:</strong> {order.customerName}</p>
                            <p><strong>Email:</strong> {order.customerEmail}</p>
                            <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">Payment Information</div>
                        <div className="card-body">
                            <p><strong>Card Number:</strong> **** **** **** {order.creditCardNumber?.slice(-4)}</p>
                            <p><strong>Total Amount:</strong> ${cartTotalAmount()}</p>
                            <p><strong>Status:</strong> <span className="text-success">Paid</span></p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="card mt-4">
                <div className="card-header">Order Items</div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Subtotal</th>
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
    );
};

export default OrderConfirmation;
