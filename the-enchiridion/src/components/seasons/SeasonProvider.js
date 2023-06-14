import { createContext, useState } from "react";

export const SeasonContext = createContext();

export const SeasonProvider = (props) => {
    const [seasons, setSeasons] = useState([]);
    const url = "http://localhost:8000";

    const getAllSeasons = () => {
        return fetch(`${url}/seasons`).then((res) => res.json());
    }

    const getSeasonById = (id) => {
        return fetch(`${url}/seasons/${id}`).then((res) => res.json());
    }

    return (
        <SeasonContext.Provider value={{
            seasons, setSeasons, getAllSeasons, getSeasonById
        }}>
            {props.children}
        </SeasonContext.Provider>
    );
};