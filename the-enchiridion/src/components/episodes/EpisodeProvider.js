import { createContext, useState } from "react";

export const EpisodeContext = createContext();

export const EpisodeProvider = (props) => {
    const [episode, setEpisode] = useState({});
    const url = "http://localhost:8000";

    const getEpisodeByNumberFromTMDB = (seasonNumber, episodeNumber) => {
        return fetch(`${url}/episodes/tmdb/${seasonNumber}/${episodeNumber}`).then((res) => res.json());
    }

    const getEpisodeByIdFromLocalDB = (episodeId) => {
        return fetch(`${url}/episodes/${episodeId}`).then((res) => res.json());
    }

    return (
        <EpisodeContext.Provider value={{
            episode, setEpisode, getEpisodeByNumberFromTMDB, getEpisodeByIdFromLocalDB
        }}>
            {props.children}
        </EpisodeContext.Provider>
    );
}