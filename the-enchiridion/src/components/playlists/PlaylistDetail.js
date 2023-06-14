import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PlaylistContext } from "./PlaylistProvider";

export const PlaylistDetail = () => {
    const { playlistId } = useParams();
    const { getPlaylistById } = useContext(PlaylistContext);
    const [playlist, setPlaylist] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const episodeimgURL = "https://www.themoviedb.org/t/p/w454_and_h254_bestv2"

    useEffect(() => {
        getPlaylistById(playlistId).then((res) => setPlaylist(res)).then(() => setIsLoading(false));
    }, []);

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