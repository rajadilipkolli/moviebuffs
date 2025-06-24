import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../store/actions/index";
import ProductList from "../components/ProductList";
import GenresList from "../components/GenresList";

const ProductsByGenreContainer = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const products = useSelector(state => state.products.products);
  const genres = useSelector(state => state.products.genres);
  
  // Get values directly from searchParams for data fetching
  const page = searchParams.get("page") || 1;
  const genre = searchParams.get("genre") || "";
  const queryParam = searchParams.get("query") || "";
  
  // Local state only for the search input field which can change without affecting the URL
  const [searchQuery, setSearchQuery] = useState(queryParam);
  
  const loadMovies = React.useCallback((page, genre, query) => {
    dispatch(actions.fetchProducts({ page, genre, query }));
  }, [dispatch]);
  
  useEffect(() => {
    dispatch(actions.fetchAllGenres());
    loadMovies(page, genre, queryParam);
  }, [dispatch, loadMovies, page, genre, queryParam]);
  const searchMovies = () => {
    navigate(`/genres?genre=${genre}&query=${searchQuery}&page=1`);
    loadMovies(1, genre, searchQuery);
  };

  const handleQueryChange = (e) => {
    setSearchQuery(e.target.value);
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
                  value={searchQuery}
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
            basePath="/genres"
            genre={genre}
            query={queryParam}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsByGenreContainer;
