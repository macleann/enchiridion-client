import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlaylistContext } from "../../providers/PlaylistProvider.js";
import { PlaylistCard } from "./PlaylistCard";
import { Loading } from "../svgs/Loading.js";
import { useSelector } from "react-redux";

export const Playlists = () => {
  const { playlists, setPlaylists, getAllPlaylists, getUserPlaylists } =
    useContext(PlaylistContext);
  const [isLoading, setIsLoading] = useState(true);
  const [filterToggle, setFilterToggle] = useState(false);
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.userData);

  // Get user playlists if filterToggle is true
  useEffect(() => {
    if (filterToggle) {
      try {
        getUserPlaylists()
          .then((res) => setPlaylists(res))
          .then(() => setIsLoading(false));
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        getAllPlaylists()
          .then((res) => setPlaylists(res))
          .then(() => setIsLoading(false));
      } catch (err) {
        console.error(err);
      }
    }
  }, [filterToggle]);

  // Create playlist button
  const createPlaylistButton = () => {
    if (currentUser && currentUser.id) {
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
    if (currentUser && currentUser.id) {
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

  if (isLoading) {
    // Spinning wheel loading animation
    return <Loading />;
  } else if (playlists.length === 0 || playlists.detail === "Invalid token.") {
    return (
      <>
        <div className="flex justify-end">
          {createPlaylistButton()}
        </div>
        <h1 className="my-4 text-2xl">No playlists found</h1>
      </>
    );
  }
  return (
    <>
      <div className="flex justify-around">
        {myPlaylistsButton()}
        {createPlaylistButton()}
      </div>
      <div className="flex flex-wrap justify-evenly">
        {playlists.map((playlist) => <PlaylistCard key={playlist.id} playlist={playlist} />)}
      </div>
    </>
  );
};