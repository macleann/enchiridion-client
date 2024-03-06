import { createContext, useState } from "react";

export const EpisodeContext = createContext();

export const EpisodeProvider = (props) => {
    const [episode, setEpisode] = useState({});
    const url = process.env.REACT_APP_API_URL;

    const getEpisodeByNumberFromTMDB = async (resultId, seasonNumber, episodeNumber) => {
        try {
            const response = await fetch(`${url}/episodes/tmdb_single_episode?series_id=${resultId}&season_number=${seasonNumber}&episode_number=${episodeNumber}`);
            const parsedResponse = response.json();
            return parsedResponse;
        } catch (error) {
            console.error("There was an error fetching the episode:", error);
        }
    }

    const getEpisodeByIdFromLocalDB = async (episodeId) => {
        try {
            const response = await fetch(`${url}/episodes/${episodeId}`);
            const parsedResponse = response.json();
            return parsedResponse;
        } catch (error) {
            console.error("There was an error fetching the episode:", error);
        }
    }

    return (
        <EpisodeContext.Provider value={{
            episode, setEpisode, getEpisodeByNumberFromTMDB, getEpisodeByIdFromLocalDB
        }}>
            {props.children}
        </EpisodeContext.Provider>
    );
}