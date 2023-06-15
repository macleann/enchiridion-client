import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { PlaylistContext } from "./PlaylistProvider"
import { SeasonContext } from "../seasons/SeasonProvider"

export const PlaylistForm = () => {
    const [playlist, setPlaylist] = useState({
        name: "",
        description: "",
        episodes: []
    })
    const { getPlaylistById, createPlaylist, updatePlaylist } = useContext(PlaylistContext)
    const { seasons, setSeasons, getAllSeasons, getSeasonBySeasonNumber } = useContext(SeasonContext)
    const { playlistId } = useParams()
    const [season, setSeason] = useState({
        id: 0,
        episodes: []
    })
    const [seasonNumber, setSeasonNumber] = useState(null)
    const [episodes, setEpisodes] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        getAllSeasons()
            .then((res) => setSeasons(res))
            .then(() => setIsLoading(false))
    }
    , [])

    useEffect(() => {
        if (playlistId) {
            getPlaylistById(playlistId)
                .then((res) => setPlaylist(res))
        }
    }
    , [playlistId])

    useEffect(() => {
        if (seasonNumber !== null) {
            getSeasonBySeasonNumber(seasonNumber).then((res) => {
                setSeason(res)
                const modifiedEpisodes = res.episodes
                modifiedEpisodes.map(episode => episode.series_id = 15260)
                setEpisodes(modifiedEpisodes)
            })
        }
    }, [seasonNumber])

    const handleControlledInputChange = (event) => {
        const newPlaylist = { ...playlist }
        newPlaylist[event.target.id] = event.target.value
        setPlaylist(newPlaylist)
    }

    const handleAddEpisode = (event) => {
        const newPlaylist = { ...playlist }
        const selectedEpisode = episodes.find(episode => episode.id === parseInt(event.target.value))
        selectedEpisode.order_number = newPlaylist.episodes.length + 1
        newPlaylist.episodes.push(selectedEpisode)
        setPlaylist(newPlaylist)
    }

    const handleRemoveEpisode = (event) => {
        const newPlaylist = { ...playlist }
        const episodeIndex = newPlaylist.episodes.findIndex(episode => episode.id === parseInt(event.target.value))
        newPlaylist.episodes.splice(episodeIndex, 1)
        setPlaylist(newPlaylist)
    }

    const handleSavePlaylist = (event) => {
        event.preventDefault()
        if (playlistId) {
            // update
            updatePlaylist(playlist).then(() => {
                navigate(`/playlists/${playlistId}`)
            })
        } else {
            // create
            createPlaylist(playlist).then(() => {
                navigate("/playlists")
            })
        }
    }

    if (isLoading) {
        return <h1>Loading...</h1>
    }
    return (
        <>
            <h1>{playlistId ? "Edit Playlist" : "Create Playlist"}</h1>
            <form>
                <fieldset>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" value={playlist.name} onChange={handleControlledInputChange} />
                </fieldset>
                <fieldset>
                    <label htmlFor="description">Description:</label>
                    <input type="text" id="description" value={playlist.description} onChange={handleControlledInputChange} />
                </fieldset>
                <fieldset>
                    <label htmlFor="season">Season:</label>
                    <select id="season" onChange={(event) => {
                        const selectedSeason = seasons.find(season => season.id === parseInt(event.target.value))
                        setSeasonNumber(selectedSeason.season_number)
                    }
                    }>
                        <option value="0">Select a season</option>
                        {seasons.map(season => {
                            return <option key={season.id} value={season.id}>{season.name}</option>
                        }
                        )}
                    </select>
                </fieldset>
                <fieldset>
                    <label htmlFor="episode">Episode:</label>
                    <select id="episode" onChange={handleAddEpisode}>
                        <option value="0">Select an episode</option>
                        {episodes?.map(episode => {
                            return <option key={episode.id} value={episode.id}>{episode.name}</option>
                        }
                        )}
                    </select>
                </fieldset>
                <fieldset>
                    <ol>
                        {playlist.episodes
                            .sort(episode => episode.order_number)
                            .map(episode => {
                                return <li key={episode.id}><button value={episode.id} onClick={handleRemoveEpisode}>Remove</button>Season {episode.season_number} Episode {episode.episode_number} {episode.name}</li>
                            }
                        )}
                    </ol>
                </fieldset>
                <button onClick={handleSavePlaylist}>Save Playlist</button>
            </form>
        </>
    )
}