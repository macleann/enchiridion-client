import { createContext, useState } from "react";

export const SearchContext = createContext();

export const SearchProvider = (props) => {
    const [searchResults, setSearchResults] = useState([])
    const url = process.env.API_URL;

    const getAllSearchResults = (searchTerms) => {
        return fetch(`${url}/series?q=${searchTerms}`).then(res => res.json())
    }

    const getResultById = (id) => {
        return fetch(`${url}/series/${id}`).then(res => res.json())

    }

    return (
        <SearchContext.Provider value={{
            searchResults, setSearchResults, getAllSearchResults, getResultById
        }}>
            {props.children}
        </SearchContext.Provider>
    )
}