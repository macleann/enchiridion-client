import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { SeasonContext } from "./SeasonProvider"
import { Loading } from "../svgs/Loading.js";

export const SeasonDetail = () => {
    const { resultId, seasonNumber } = useParams()
    const { getSeasonBySeasonNumber } = useContext(SeasonContext)
    const [season, setSeason] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const seasonimgURL = "https://www.themoviedb.org/t/p/original"
    const episodeimgURL = "https://www.themoviedb.org/t/p/w454_and_h254_bestv2"

    useEffect(() => {
        getSeasonBySeasonNumber(seasonNumber, resultId).then((res) => setSeason(res)).then(() => setIsLoading(false))
    }, [])

    if (isLoading) {
        return <Loading />
    } else if (season.detail === "Not found.") {
        return <h1>Season not found</h1>
    }
    return (
        <>
            <h2 className="text-3xl text-center mb-6">{season.name}</h2>
            <div className="flex-column justify-center">
                <div className="m-8"><img src={`${seasonimgURL}${season.poster_path}`}/></div>
                <div className="m-8 text-center text-gray-500">{season.overview}</div>
            </div>
            <div>
                {season.episodes.map((episode) => {
                return (
                    <div key={`episode--${episode.id}`} className="flex justify-center">
                        <div className="w-1/2 justify-end pr-4 pl-8"><img src={`${episodeimgURL}${episode.still_path}`}/></div>
                        <div className="w-1/2 justify-start pl-4 pr-8">
                            <Link to={`episode/${episode.episode_number}`}>
                                <h3 className="text-2xl">{episode.name}</h3>
                            </Link>
                            <p className="text-gray-500">{episode.overview}</p>
                        </div>
                    </div>
                );
                })}
            </div>
        </>
    )
}