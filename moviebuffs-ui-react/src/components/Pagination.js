import React from "react";
import { Link } from "react-router-dom";

const Pagination = (props) => {
    const { products, basePath, query = "", genre = "" } = props;
    
    // If no products or only one page, don't render pagination
    if (!products || !products.data || products.totalPages <= 1) {
        return null;
    }

    const searchParam = query !== "" ? `&query=${query}` : "";
    const genreParam = genre !== "" ? `&genre=${genre}` : "";
    
    const firstPage = `${basePath}?page=1${genreParam}${searchParam}`;
    const prevPage = `${basePath}?page=${products.pageNumber - 1}${genreParam}${searchParam}`;
    const nextPage = `${basePath}?page=${products.pageNumber + 1}${genreParam}${searchParam}`;
    const lastPage = `${basePath}?page=${products.totalPages}${genreParam}${searchParam}`;

    return (
        <nav aria-label="Page navigation" className="my-4">
            <ul className="pagination justify-content-center">
                <li className={`page-item ${products.pageNumber <= 1 ? "disabled" : ""}`}>
                    <Link className="page-link" to={firstPage} aria-label="First">
                        <span aria-hidden="true">&laquo;&laquo;</span>
                        <span className="sr-only">First</span>
                    </Link>
                </li>
                <li className={`page-item ${products.pageNumber <= 1 ? "disabled" : ""}`}>
                    <Link className="page-link" to={prevPage} aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                        <span className="sr-only">Previous</span>
                    </Link>
                </li>
                <li className="page-item active">
                    <span className="page-link">
                        {products.pageNumber} of {products.totalPages}
                    </span>
                </li>
                <li className={`page-item ${products.pageNumber >= products.totalPages ? "disabled" : ""}`}>
                    <Link className="page-link" to={nextPage} aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                        <span className="sr-only">Next</span>
                    </Link>
                </li>
                <li className={`page-item ${products.pageNumber >= products.totalPages ? "disabled" : ""}`}>
                    <Link className="page-link" to={lastPage} aria-label="Last">
                        <span aria-hidden="true">&raquo;&raquo;</span>
                        <span className="sr-only">Last</span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
