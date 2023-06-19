import { createContext, useState } from "react";

export const SearchContext = createContext();

export const SearchProvider = (props) => {
    const [searchResults, setSearchResults] = useState([])
    const url = "http://localhost:8000"
    const currentUser = JSON.parse(localStorage.getItem("enchiridion_user"))
    if (currentUser?.token) {
        currentUser.token = currentUser.token.replace(/['"]+/g, '')
    }

    const getAllSearchResults = (searchTerms) => {
        return fetch(`${url}/series?q=${searchTerms}`, 
        {
            headers: {
                "Authorization": `Token ${currentUser.token}`
            }
        }
        ).then(res => res.json())
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