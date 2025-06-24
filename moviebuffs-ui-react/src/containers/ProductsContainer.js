import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../store/actions/index";
import ProductList from "../components/ProductList";
import GenresList from "../components/GenresList";

const ProductsContainer = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const products = useSelector(state => state.products.products);
  const genres = useSelector(state => state.products.genres);
    const [state, setState] = useState({
    page: searchParams.get("page") || 1,
    query: searchParams.get("query") || ""
  });
  
  const loadMovies = React.useCallback((page, query) => {
    dispatch(actions.fetchProducts({ page, query }));
  }, [dispatch]);
  
  useEffect(() => {
    dispatch(actions.fetchAllGenres());
    loadMovies(state.page, state.query);
  }, [dispatch, searchParams, loadMovies, state.page, state.query]); // Include all dependencies

  const searchMovies = () => {
    navigate(`/products?page=1&query=${state.query}`);
    loadMovies(1, state.query);
  };

  const handleQueryChange = (e) => {
    setState({ ...state, query: e.target.value });
  };

  const handleAddToCart = (product) => {
    dispatch(actions.addProductToCart(product));
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          <div className="card">
            <div className="card-header">Search</div>
            <div className="card-body">
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search for movies"
                  value={state.query}
                  onChange={handleQueryChange}
                  onKeyPress={(e) => e.key === "Enter" && searchMovies()}
                />
                <button className="btn btn-primary" onClick={searchMovies}>
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-header">Genres</div>
            <div className="card-body">
              <GenresList genres={genres} />
            </div>
          </div>
        </div>

        <div className="col-md-9">
          <ProductList 
            products={products} 
            onAddToCart={handleAddToCart}
            basePath="/products"
            query={state.query}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsContainer;
