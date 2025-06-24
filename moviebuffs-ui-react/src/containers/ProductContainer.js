import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../store/actions/index";
import Product from "../components/Product";

const ProductContainer = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector(state => state.products.product);

  useEffect(() => {
    dispatch(actions.fetchProductById(id));
  }, [dispatch, id]);

  const addProductToCart = (product) => {
    dispatch(actions.addProductToCart(product));
  };

  return (
    <Product product={product} onAddToCart={addProductToCart} />
  );
};

export default ProductContainer;
