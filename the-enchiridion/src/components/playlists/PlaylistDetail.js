import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PlaylistContext } from "./PlaylistProvider";

export const PlaylistDetail = () => {
    const { playlistId } = useParams();
    const { getPlaylistById, deletePlaylist } = useContext(PlaylistContext);
    const [playlist, setPlaylist] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const episodeimgURL = "https://www.themoviedb.org/t/p/w454_and_h254_bestv2"
    const navigate = useNavigate()

    useEffect(() => {
        getPlaylistById(playlistId).then((res) => setPlaylist(res)).then(() => setIsLoading(false));
    }, []);

    const editPlaylistButton = () => {
        const currentUser = JSON.parse(localStorage.getItem("enchiridion_user"));
        if (playlist.user_id === currentUser?.id) {
            return (
                <button onClick={() => navigate(`/playlists/${playlistId}/edit`)}>
                    Edit Playlist
                </button>
            );
        }
    };

    const deletePlaylistButton = () => {
        const currentUser = JSON.parse(localStorage.getItem("enchiridion_user"));
        if (playlist.user_id === currentUser?.id) {
            return (
                <button
                    onClick={() => {
                        deletePlaylist(playlistId).then(() => navigate("/playlists"));
                    }}
                >
                    Delete Playlist
                </button>
            );
        }
    };

    if (isLoading) {
        return <h1>Loading...</h1>;
    } else if (playlist.message) {
        console.log(playlist.message)
        return <h1>Playlist not found</h1>;
    }
    return (
        <>
            <h2 className="text-3xl text-center mb-6">{playlist.name}</h2>
            <div className="flex justify-center">
                <div className="w-1/2 justify-start pl-4 pr-8">{playlist.description}</div>
            </div>
            {editPlaylistButton()}
            {deletePlaylistButton()}
            <div>
                {playlist.episodes.map((episode) => {
                return (
                    <div key={`episode--${episode.id}`} className="flex justify-center">
                        <div className="w-1/2 justify-end pr-4 pl-8"><img src={`${episodeimgURL}${episode.still_path}`}/></div>
                        <div className="w-1/2 justify-start pl-4 pr-8">
                            <Link to={`${episode.id}`}>
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