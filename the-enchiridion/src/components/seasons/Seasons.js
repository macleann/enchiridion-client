import { useContext, useEffect, useState } from "react";
import { SeasonContext } from "./SeasonProvider";
import { Link } from "react-router-dom";
import { Loading } from "../svgs/Loading.js";

export const Seasons = ({ seasons }) => {
  const smImgUrl = "https://www.themoviedb.org/t/p/w130_and_h195_bestv2";
  const lgImgUrl = "https://www.themoviedb.org/t/p/w260_and_h390_bestv2";
  const [screenSize, setScreenSize] = useState(getCurrentDimension());

  function getCurrentDimension() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrentDimension());
    };
    window.addEventListener("resize", updateDimension);

    return () => {
      window.removeEventListener("resize", updateDimension);
    };
  }, [screenSize]);

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
            <div key={`season--${season.id}`} className="card">
              <Link
                to={`season/${season.season_number}`}
                className="md:flex md:h-full w-full md:items-center"
              >
                <div className="md:w-1/2">
                  <div className="h-full">
                    <img
                      className="rounded-sm md:rounded-md lg:rounded-lg xl:rounded-xl"
                      src={
                        screenSize.width < 768
                          ? `${smImgUrl}${season.poster_path}`
                          : `${lgImgUrl}${season.poster_path}`
                      }
                      alt={season.name}
                    />
                  </div>
                </div>
                {screenSize.width > 767 ? (
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
                    <div className="flex justify-between pt-4 text-center text-xs text-gray-500">
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