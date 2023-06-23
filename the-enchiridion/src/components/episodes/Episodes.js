import { Link, useParams } from "react-router-dom";

export const Episodes = ({ episodes, isMobile }) => {
  const { seasonNumber } = useParams();
  let episodeimgURL = "";

  const episodeLink = (episode) => {
    if (seasonNumber) {
      return `episode/${episode.episode_number}`;
    } else {
      return `${episode.id}`;
    }
  };

  if (isMobile) {
    episodeimgURL = "https://www.themoviedb.org/t/p/original";
  } else {
    episodeimgURL = "https://www.themoviedb.org/t/p/w300";
  }

  if (episodes.length === 0) {
    return (
      <div className="flex justify-center my-4">
        <h2 className="text-2xl text-center">No episodes found</h2>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap justify-center">
      {episodes.map((episode) => {
        return !isMobile ? (
          <Link
            key={`episode--${episode.id}`}
            to={episodeLink(episode)}
            className="card"
          >
            <p className="text-sm md:text-lg text-gray-500">{episode.order_number ? episode.order_number : null}</p>
            <div className="flex items-center">
              <div className="mr-1">
                <img
                  className="rounded-md"
                  src={`${episodeimgURL}${episode.still_path}`}
                />
              </div>
              <div className="ml-1">
                <h3 className="text-xl md:text-2xl text-center md:text-left">
                  {episode.name}
                </h3>
                <h4 className="text-lg md:text-xl text-center md:text-left">
                  Season {episode.season_number} Episode{" "}
                  {episode.episode_number}
                </h4>
                <p className="text-gray-500">{episode.overview}</p>
              </div>
            </div>
          </Link>
        ) : (
          <Link
            key={`episode--${episode.id}`}
            to={episodeLink(episode)}
            className="card"
          >
            <p className="text-sm md:text-lg text-gray-500">{episode.order_number ? episode.order_number : null}</p>
            <div className="flex justify-center items-center">
              <div>
                <h3 className="text-xl md:text-2xl text-center md:text-left">
                  {episode.name}
                </h3>
                <h4 className="text-lg md:text-xl text-center md:text-left text-gray-500">
                  Season {episode.season_number} Episode{" "}
                  {episode.episode_number}
                </h4>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
