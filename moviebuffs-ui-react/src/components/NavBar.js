import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { cleanState } from "../store/localStorage";

const NavBar = () => {
  const cart = useSelector(state => state.cart.cart);
  const user = useSelector(state => state.user);
  const navigate = useNavigate();

  const cartItemsCount = () => {
    return cart
      .map(item => item.quantity)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  };

  const logoutHandler = () => {
    cleanState();
    navigate("/");
    window.location.reload(); // Force reload to clear any remaining state
  };

  const authenticatedLinks = user && user.access_token ? (
    <>
      <li className="nav-item">
        <span className="nav-link">Welcome, {user.username}</span>
      </li>
      <li className="nav-item">
        <button className="btn btn-link nav-link" onClick={logoutHandler}>Logout</button>
      </li>
    </>
  ) : (
    <li className="nav-item">
      <Link className="nav-link" to="/login">Login</Link>
    </li>
  );

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">MovieBuffs</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item">
              <Link className="nav-link" to="/products">Home</Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            {authenticatedLinks}
            <li className="nav-item">
              <Link className="nav-link" to="/cart">
                <i className="bi bi-cart"></i> Cart {cartItemsCount() > 0 && `(${cartItemsCount()})`}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
