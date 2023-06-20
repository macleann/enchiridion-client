import { useContext, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { SearchContext } from "./SearchProvider.js"
import { Loading } from "../svgs/Loading.js"
import { Seasons } from "../seasons/Seasons.js"

export const SearchDetail = () => {
    const { getResultById } = useContext(SearchContext)
    const [result, setResult] = useState({})
    const { resultId } = useParams()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        getResultById(resultId)
            .then(res => setResult(res))
            .then(() => setIsLoading(false))
    }, [])

    const displayPoster = (result) => {
        if (result.poster_path !== null) {
            return <img
            src={`https://www.themoviedb.org/t/p/original${result.poster_path}`}
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

    if (isLoading) {
        return <Loading />
    }
    return (
        <div className="mx-2 my-4">
            <div className="flex">
                <div className="mx-2">
                    {displayPoster(result)}
                </div>
                <div className="mx-2">
                    <h1 className="text-xl md:text-2xl">{result.name}</h1>
                    <h2>{result.first_air_date}</h2>
                    <p className="text-sm md:text-base text-gray-500">{result.overview}</p>
                </div>
            </div>
            <div className="mx-2 my-4">
                <Seasons seasons={result.seasons} />
            </div>
        </div>
    )
}