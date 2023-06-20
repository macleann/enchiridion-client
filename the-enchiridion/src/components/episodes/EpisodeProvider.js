import { createContext, useState } from "react";

export const EpisodeContext = createContext();

export const EpisodeProvider = (props) => {
    const [episode, setEpisode] = useState({});
    const url = "http://localhost:8000";

    const getEpisodeByNumberFromTMDB = (resultId, seasonNumber, episodeNumber) => {
        return fetch(`${url}/episodes/tmdb_single_episode?series_id=${resultId}&season_number=${seasonNumber}&episode_number=${episodeNumber}`).then((res) => res.json());
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