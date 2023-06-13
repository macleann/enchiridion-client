import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PlaylistContext } from './PlaylistProvider';

export const Playlists = () => {
    const { playlists, setPlaylists, getAllPlaylists, getUserPlaylists } = useContext(PlaylistContext)
    const { section } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        if (section === "my-playlists") {
            getUserPlaylists().then((res) => setPlaylists(res)).then(() => setIsLoading(false))
        } else {
            getAllPlaylists().then((res) => setPlaylists(res)).then(() => setIsLoading(false))
        }
    }, [section])

    if (isLoading) {
        return <h1>Loading...</h1>
    } else if (playlists.length === 0 || playlists.detail === "Invalid token.") {
        return <h1>No playlists found</h1>
    }
    return (
        <>
            <h1>Playlists</h1>
            <button onClick={() => navigate("/playlists/create")}>Create Playlist</button>
            <ul>
                {playlists.map(playlist => {
                    return <li key={playlist.id}><Link to={`/playlists/${playlist.id}`}>{playlist.name}</Link></li>
                })}
            </ul>
        </>
    )
}