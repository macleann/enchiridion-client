import { createContext, useState } from "react";

export const SeasonContext = createContext();

export const SeasonProvider = (props) => {
    const [seasons, setSeasons] = useState([]);
    const url = "http://localhost:8000";

    const getSeasonBySeasonNumber = (season_number, resultId) => {
        return fetch(`${url}/seasons/${season_number}?series_id=${resultId}`).then((res) => res.json());
    }

    return (
        <SeasonContext.Provider value={{
            seasons, setSeasons, getSeasonBySeasonNumber
        }}>
            {props.children}
        </SeasonContext.Provider>
    );
};