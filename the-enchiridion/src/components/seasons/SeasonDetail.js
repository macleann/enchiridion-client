import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { SeasonContext } from "./SeasonProvider"

export const SeasonDetail = () => {
    const { seasonId } = useParams()
    const { getSeasonById } = useContext(SeasonContext)
    const [season, setSeason] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const seasonimgURL = "https://www.themoviedb.org/t/p/w260_and_h390_bestv2"
    const episodeimgURL = "https://www.themoviedb.org/t/p/w454_and_h254_bestv2"

    useEffect(() => {
        getSeasonById(seasonId).then((res) => setSeason(res)).then(() => setIsLoading(false))
    }, [])

    if (isLoading) {
        return <h1>Loading...</h1>
    } else if (season.detail === "Not found.") {
        return <h1>Season not found</h1>
    }
    return (
        <>
            <h2 className="text-3xl text-center mb-6">{season.name}</h2>
            <div className="flex justify-center">
                <div className="w-1/2 justify-end pr-4 pl-8"><img src={`${seasonimgURL}${season.poster_path}`}/></div>
                <div className="w-1/2 justify-start pl-4 pr-8">{season.overview}</div>
            </div>
            <div>
                {season.episodes.map((episode) => {
                return (
                    <div key={`episode--${episode.id}`} className="flex justify-center">
                        <div className="w-1/2 justify-end pr-4 pl-8"><img src={`${episodeimgURL}${episode.still_path}`}/></div>
                        <div className="w-1/2 justify-start pl-4 pr-8">
                            <Link to={`/episodes/${episode.episode_number}`}>
                                <h3 className="text-2xl">{episode.name}</h3>
                            </Link>
                            <p>{episode.overview}</p>
                        </div>
                    </div>
                );
                })}
            </div>
        </>
    )
}