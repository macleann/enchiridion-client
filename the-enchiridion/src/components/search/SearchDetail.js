import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useScreenSize } from "../utils/useScreenSize.js"
import { SearchContext } from "./SearchProvider.js"
import { Loading } from "../svgs/Loading.js"
import { Seasons } from "../seasons/Seasons.js"

export const SearchDetail = () => {
    const { getResultById } = useContext(SearchContext)
    const [result, setResult] = useState({})
    const { resultId } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const { isMobile } = useScreenSize();
    let showImgURL = "https://www.themoviedb.org/t/p/original"

    useEffect(() => {
        getResultById(resultId)
            .then(res => setResult(res))
            .then(() => setIsLoading(false))
    }, [])

    const displayPoster = (result) => {
        if (result.poster_path !== null) {
            if (isMobile) {
                showImgURL = "https://www.themoviedb.org/t/p/original";
              } else {
                showImgURL = "https://www.themoviedb.org/t/p/w500";
              }
            return <img
            src={`${showImgURL}${result.poster_path}`}
            alt={result.name}
            className="rounded"
          />
        } else {
            return <img
            src="https://via.placeholder.com/150x225.png?text=No+Image"
            alt={result.name}
            className="rounded"
          />
        }
    }

    const displayAirDate = (result) => {
        const resultDate = new Date(result.first_air_date);
        const formattedDate = resultDate.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
        return formattedDate;
      };

    if (isLoading) {
        return <Loading />
    } else if (result.error) {
        console.log(result.error)
        return (
            <div className="mx-2 my-4">
                <h1 className="text-xl md:text-2xl">TMDB failed to respond</h1>
                <Link to="/search" className="text-blue-500 hover:text-blue-700">Back to search</Link>
            </div>
        )
    }
    return (
        <>
        <Link className="ml-4 underline" to={`/search`}>Back to search</Link>
          <h2 className="text-3xl text-center mb-6">{result.name}</h2>
          <div className="flex flex-col items-center">
            <div className="flex justify-center m-8 md:w-full">
              {displayPoster(result)}
            </div>
            <div className="flex-col mx-4">
              <div className="md:w-3/4 my-2 md:my-8 mx-auto text-center md:text-xl text-gray-500">
                {result.overview}
              </div>
              <div className="md:w-3/4 my-2 md:my-8 mx-auto text-center md:text-xl text-gray-500">
                Began airing {displayAirDate(result)}
              </div>
            </div>
          </div>
          <div className="mx-2 my-4">
            <Seasons seasons={result.seasons} />
          </div>
        </>
      );
}