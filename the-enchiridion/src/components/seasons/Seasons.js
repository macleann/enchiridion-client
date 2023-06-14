import { useContext, useEffect, useState } from "react";
import { SeasonContext } from "./SeasonProvider";
import { Link } from "react-router-dom";

export const Seasons = () => {
    const { seasons, setSeasons, getAllSeasons } = useContext(SeasonContext);
    const [isLoading, setIsLoading] = useState(true);
    const imgURL = "https://www.themoviedb.org/t/p/w260_and_h390_bestv2";

    useEffect(() => {
        getAllSeasons().then((res) => setSeasons(res)).then(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return <h1>Loading...</h1>;
    } else if (seasons.length === 0) {
        return <h1>No seasons found</h1>;
    }
    return (
        <>
          <h1 className="mt-5 text-3xl text-center">Seasons</h1>
          <div className="flex flex-wrap justify-evenly">
            {seasons.map((season) => {
              return (
                <div key={`season--${season.id}`} className="pop-out flex-col w-1/6 mx-2 my-5 border-2 border-none rounded-lg shadow-md p-4 backdrop-blur-sm cursor-pointer">
                  <Link to={`season/${season.id}`}>
                    <div>
                        <img className="rounded-lg" src={`${imgURL}${season.poster_path}`} alt={season.name} />
                    </div>
                    <div className="pt-4 text-xl text-center">{season.name}</div>
                  </Link>
                </div>
              );
            })}
          </div>
        </>
    );
};