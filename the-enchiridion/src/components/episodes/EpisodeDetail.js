import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EpisodeContext } from "./EpisodeProvider";
import { Loading } from "../svgs/Loading.js";


export const EpisodeDetail = () => {
    const { episode, setEpisode, getEpisodeByNumberFromTMDB, getEpisodeByIdFromLocalDB } = useContext(EpisodeContext);
    const { episodeId, seasonNumber, episodeNumber } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const episodeimgURL = "https://www.themoviedb.org/t/p/w454_and_h254_bestv2"

    useEffect(() => {
        if (episodeId) {
            getEpisodeByIdFromLocalDB(episodeId).then((res) => setEpisode(res)).then(() => setIsLoading(false));
        } else if (seasonNumber && episodeNumber) {
            getEpisodeByNumberFromTMDB(seasonNumber, episodeNumber).then((res) => setEpisode(res)).then(() => setIsLoading(false));
        }
    }, []);

    if (isLoading) {
        return <Loading />;
    } else if (episode.error) {
        console.log(episode.error)
        return <h1>Episode not found</h1>;
    }
    return <>
        <div>
            <h2 className="mt-4 text-3xl text-center">{episode.name}</h2>
            <div className="flex justify-center mt-4">
                <div className="w-1/2 pr-4 pl-8"><img src={`${episodeimgURL}${episode.still_path}`}/></div>
                <div className="w-1/2 flex-col justify-start pl-4 pr-8">
                    <div>{episode.overview}</div>
                    <div className="mt-4">Air Date: {episode.air_date}</div>
                    <div className="mt-4">Runtime: {episode.runtime} minutes</div>
                </div>
            </div>
        </div>
        
    </>
}