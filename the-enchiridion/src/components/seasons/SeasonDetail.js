import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SeasonContext } from "../../providers/SeasonProvider";
import { useScreenSize } from "../../utils/useScreenSize.js";
import { Episodes } from "../episodes/Episodes.js";
import { Loading } from "../svgs/Loading.js";

export const SeasonDetail = () => {
  const { resultId, seasonNumber } = useParams();
  const { getSeasonBySeasonNumber } = useContext(SeasonContext);
  const { isMobile } = useScreenSize();
  const [season, setSeason] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  let seasonimgURL = "";
  const episodeimgURL = "https://www.themoviedb.org/t/p/w454_and_h254_bestv2";

  useEffect(() => {
    getSeasonBySeasonNumber(seasonNumber, resultId)
      .then((res) => setSeason(res))
      .then(() => setIsLoading(false));
  }, []);

  if (isMobile) {
    seasonimgURL = "https://www.themoviedb.org/t/p/original";
  } else {
    seasonimgURL = "https://www.themoviedb.org/t/p/w500";
  }

  const displayAirDate = (season) => {
    const seasonDate = new Date(season.air_date);
    const formattedDate = seasonDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    return formattedDate;
  };

  if (isLoading) {
    return <Loading />;
  } else if (season.error) {
    console.log(season.error);
    return (
      <div className="mx-2 my-4">
        <h1 className="text-xl md:text-2xl">TMDB failed to respond</h1>
        <Link to="/search" className="text-blue-500 hover:text-blue-700">
          Back to search
        </Link>
      </div>
    );
  }
  return (
    <>
    <Link className="ml-4 underline" to={`/search/${resultId}`}>Back to show</Link>
      <h2 className="text-3xl text-center mb-6">{season.name}</h2>
      <div className="flex flex-col items-center">
        <div className="flex justify-center my-2 mx-8 md:w-full">
          <img
            className="rounded-lg"
            src={`${seasonimgURL}${season.poster_path}`}
          />
        </div>
        <div className="flex-col justify-center">
          <div className="md:w-3/4 my-2 md:my-8 mx-auto text-center text-gray-500">
            {season.overview}
          </div>
          <div className="md:w-3/4 my-2 md:my-8 mx-auto text-center italic text-gray-500">
            Originally aired {displayAirDate(season)}
          </div>
        </div>
      </div>
      <Episodes episodes={season.episodes} isMobile={isMobile} />
    </>
  );
};
