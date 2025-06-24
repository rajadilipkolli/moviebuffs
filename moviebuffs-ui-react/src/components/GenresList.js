import React from "react";
import { NavLink, useSearchParams } from "react-router-dom";

const GenresList = ({ genres }) => {
    const [searchParams] = useSearchParams();
    const currentGenre = searchParams.get("genre") || "";
    
    return (
        <ul className="list-group list-group-flush">
            {genres.map(g => (
                <NavLink 
                    key={g.id} 
                    className={({isActive}) => {
                        // Only consider this link active if the current genre matches
                        const isGenreActive = g.slug === currentGenre;
                        return isGenreActive ? "list-group-item active" : "list-group-item";
                    }}
                    to={`/genres?genre=${g.slug}`}
                >
                    {g.name}
                </NavLink>
            ))}
        </ul>
    );
};

export default GenresList;
