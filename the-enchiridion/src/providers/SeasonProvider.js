import { createContext, useState } from "react";

export const SeasonContext = createContext();

export const SeasonProvider = (props) => {
    const [seasons, setSeasons] = useState([]);
    const url = process.env.API_URL;

    const getAllSeasons = (resultId) => {
        return fetch(`${url}/seasons?series_id=${resultId}`).then((res) => res.json());
    }

    const getSeasonBySeasonNumber = (season_number, resultId) => {
        return fetch(`${url}/seasons/${season_number}?series_id=${resultId}`).then((res) => res.json());
    }

    return (
        <SeasonContext.Provider value={{
            seasons, setSeasons, getAllSeasons, getSeasonBySeasonNumber
        }}>
            {props.children}
        </SeasonContext.Provider>
    );
};