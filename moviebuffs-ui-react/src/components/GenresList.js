import React from "react";
import { NavLink } from "react-router-dom";

const GenresList = ({ genres }) => {
    return (
        <ul className="list-group list-group-flush">
            {genres.map(g => (
                <NavLink 
                    key={g.id} 
                    className={({isActive}) => 
                        isActive ? "list-group-item active" : "list-group-item"
                    }
                    to={`/genres?genre=${g.slug}`}
                >
                    {g.name}
                </NavLink>
            ))}
        </ul>
    );
};

export default GenresList;
