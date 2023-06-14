import { createContext, useState } from "react";

export const SeasonContext = createContext();

export const SeasonProvider = (props) => {
    const [seasons, setSeasons] = useState([]);
    const url = "http://localhost:8000";

    const getAllSeasons = () => {
        return fetch(`${url}/seasons`).then((res) => res.json());
    }

    const getSeasonBySeasonNumber = (season_number) => {
        return fetch(`${url}/seasons/${season_number}`).then((res) => res.json());
    }

    return (
        <SeasonContext.Provider value={{
            seasons, setSeasons, getAllSeasons, getSeasonBySeasonNumber
        }}>
            {props.children}
        </SeasonContext.Provider>
    );
};