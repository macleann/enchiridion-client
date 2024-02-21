import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { EpisodeContext } from "../../providers/EpisodeProvider";
import { Loading } from "../svgs/Loading.js";


export const EpisodeDetail = () => {
    const { episode, setEpisode, getEpisodeByNumberFromTMDB, getEpisodeByIdFromLocalDB } = useContext(EpisodeContext);
    const { playlistId, episodeId, resultId, seasonNumber, episodeNumber } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const episodeimgURL = "https://www.themoviedb.org/t/p/w454_and_h254_bestv2"

    useEffect(() => {
        if (episodeId) {
            getEpisodeByIdFromLocalDB(episodeId).then((res) => setEpisode(res)).then(() => setIsLoading(false));
        } else if (resultId && seasonNumber && episodeNumber) {
            getEpisodeByNumberFromTMDB(resultId, seasonNumber, episodeNumber).then((res) => setEpisode(res)).then(() => setIsLoading(false));
        }
    }, []);

    const backToLink = () => {
      if (playlistId && episodeId) {
        return `/playlists/${playlistId}`;
      } else if (resultId && seasonNumber && episodeNumber) {
        return `/search/${resultId}/season/${seasonNumber}`;
      }
    };

    const displayAirDate = (episode) => {
        const episodeDate = new Date(episode.air_date);
        const formattedDate = episodeDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
        return formattedDate;
    };

    if (isLoading) {
        return <Loading />;
    } else if (episode.error) {
        console.log(episode.error)
        return (
          <div className="text-center">
            <h1 className="text-xl md:text-2xl">TMDB failed to respond</h1>
            <Link to={`/search/${resultId}/season/${seasonNumber}`} className="text-blue-500 hover:text-blue-700">Back to season {seasonNumber}</Link>
          </div>
        );
    }
    return (
      <>
        <Link
          className="ml-4 underline"
          to={backToLink()}
        >
          {playlistId ? "Back to playlist" : "Back to season "}
        </Link>
        <div>
          <h2 id="episodeTitle" className="mt-4 text-3xl text-center">{episode?.name}</h2>
          <div className="flex flex-col md:flex-row lg:w-2/3 justify-center items-center mt-4 mx-auto">
            <div className="w-full md:w-1/2 md:mr-4 md:ml-8">
              <img id="episodeImg" src={`${episodeimgURL}${episode?.still_path}`} alt={`A still from ${episode?.name}`}/>
            </div>
            <div className="flex-col md:w-1/2 justify-start md:ml-4 md:mr-8 py-10 text-gray-500">
              <div id="episodeOverview" className="mt-4 md:mt-0">{episode.overview}</div>
              <div id="episodeInfo" className="mt-4 text-center">
                Air Date: {displayAirDate(episode)} • Runtime:{" "}
                {episode?.runtime} minutes
              </div>
            </div>
          </div>
        </div>
      </>
    );
}