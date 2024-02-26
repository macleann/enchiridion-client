import { useScreenSize } from "../../utils/useScreenSize";
import { Link } from "react-router-dom";

export const Seasons = ({ seasons }) => {
  const { isMobile } = useScreenSize();
  let seasonImgURL = ""

  const displayPoster = (season) => {
    if (season.poster_path !== null) {
      if (isMobile) {
        seasonImgURL = "https://www.themoviedb.org/t/p/original";
      } else {
        seasonImgURL = "https://www.themoviedb.org/t/p/w500";
      }
      return (
        <img
          src={`${seasonImgURL}${season.poster_path}`}
          alt={season.name}
          className="rounded"
        />
      );
    } else {
      return (
        <img
          src="https://via.placeholder.com/150x225.png?text=No+Image"
          alt={season.name}
          className="rounded"
        />
      );
    }
  };

  if (seasons.length === 0) {
    return <h1>No seasons found</h1>;
  }
  return (
    <>
      <h1 className="mt-5 text-3xl text-center">Seasons</h1>
      <div className="flex flex-wrap justify-evenly">
        {seasons.map((season) => {
          season.air_date = new Date(season.air_date).toLocaleDateString(
            "en-US",
            { month: "short", year: "numeric" }
          );
          return (
            <div key={`season--${season.id}`} id={`season-${season.id}-card`} className="card">
              <Link
                id={`season-${season.season_number}-link`}
                to={`season/${season.season_number}`}
                className="md:flex md:h-full w-full md:items-center"
              >
                <div className="md:w-1/2">
                  <div className="h-full">
                    {displayPoster(season)}
                  </div>
                </div>
                {!isMobile ? (
                  <div className="md:w-1/2">
                    {" "}
                    {/* User is most likely on a desktop/tablet, show all season info */}
                    <div className="flex-col flex-grow p-4">
                      <div className="pt-4 text-xl text-center">
                        {season.name}
                      </div>
                      <div className="flex-grow pt-4 text-left text-gray-500">
                        {season.overview.length > 200
                          ? `${season.overview.substring(0, 200)}...`
                          : season.overview}
                      </div>
                      <div className="pt-4 text-center text-xs text-gray-500">
                        <p>
                          {season.air_date} • {season.episode_count} episodes
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* User is most likely on a mobile device, show season info without the overview */}
                    <div className="pt-4 text-xl text-center">
                      {season.name}
                    </div>
                    <div className="flex justify-center pt-4 text-center text-xs text-gray-500">
                      <p>
                        {season.air_date} • {season.episode_count} episodes
                      </p>
                    </div>
                  </>
                )}
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
};
