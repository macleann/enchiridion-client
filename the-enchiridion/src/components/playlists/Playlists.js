import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useScreenSize } from "../utils/useScreenSize.js";
import { PlaylistContext } from "./PlaylistProvider";
import { makePlaylistImage } from "../utils/makePlaylistImage.js";
import { Loading } from "../svgs/Loading.js";

export const Playlists = () => {
  const { playlists, setPlaylists, getAllPlaylists, getUserPlaylists } =
    useContext(PlaylistContext);
  const [isLoading, setIsLoading] = useState(true);
  const [filterToggle, setFilterToggle] = useState(false);
  const navigate = useNavigate();
  const { isMobile } = useScreenSize();
  const currentUser = JSON.parse(localStorage.getItem("enchiridion_user"));

  // Get all playlists on page load
  useEffect(() => {
    getAllPlaylists()
      .then((res) => setPlaylists(res))
      .then(() => {
        setTimeout(() => setIsLoading(false), 500);
      });
  }, []);

  // Get user playlists if filterToggle is true
  useEffect(() => {
    if (filterToggle) {
      getUserPlaylists()
        .then((res) => setPlaylists(res))
        .then(() => {
          setTimeout(() => setIsLoading(false), 500);
        });
    } else {
      getAllPlaylists()
        .then((res) => setPlaylists(res))
        .then(() => {
          setTimeout(() => setIsLoading(false), 500);
        });
    }
  }, [filterToggle]);

  // Create playlist button
  const createPlaylistButton = () => {
    if (currentUser) {
      return (
        <button
          className="button-primary m-2"
          onClick={() => navigate("/playlists/create")}
        >
          Create Playlist
        </button>
      );
    }
  };

  // My playlists button
  const myPlaylistsButton = () => {
    if (currentUser) {
      return (
        <button
          className="button-primary m-2"
          onClick={(e) => {
            e.preventDefault();
            setIsLoading(true);
            setFilterToggle(!filterToggle);
          }}
        >
          {filterToggle ? "All Playlists" : "My Playlists"}
        </button>
      );
    }
  };

  // Calculate total runtime of all episodes in a playlist
  const calculateTotalRuntime = (episodes) => {
    const totalRunTimeMins = episodes.reduce((runtimeAccumulator, episode) => {
      return runtimeAccumulator + parseInt(episode.runtime);
    }, 0);
    const hours = Math.floor(totalRunTimeMins / 60);
    const minutes = totalRunTimeMins % 60;
    return `${hours}h ${minutes}m`;
  };

  if (isLoading) {
    // Spinning wheel loading animation
    return <Loading />;
  } else if (playlists.length === 0 || playlists.detail === "Invalid token.") {
    return <h1 className="my-4 text-2xl">No playlists found</h1>;
  }
  return (
    <>
      <div className="flex justify-around">
        {myPlaylistsButton()}
        {createPlaylistButton()}
      </div>
      <div className="flex flex-wrap justify-evenly">
        {playlists.map((playlist) => {
          const playlistImage = makePlaylistImage(playlist);
          const printTotalRuntime = calculateTotalRuntime(playlist.episodes);
          const episodeCount = playlist.episodes.length;
          return (
            <div key={playlist.id} className="card-playlists">
              <Link to={`/playlists/${playlist.id}`}>
                <div>{playlistImage}</div>
                <div>
                  <div className="text-lg md:text-xl text-center">{playlist.name}</div>
                  {isMobile ? null : (
                    <div className="m-4 text-center text-gray-500">
                    {playlist.description.length > 200 ? (
                      <p>{playlist.description.slice(0, 200)}...</p>
                    ) : (
                      <p>{playlist.description}</p>
                    )}
                  </div>
                  )}
                  <div className="text-xs text-center text-gray-500">
                    <p>
                      {episodeCount} episodes • {printTotalRuntime}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
};