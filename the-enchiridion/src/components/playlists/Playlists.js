import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlaylistContext } from "./PlaylistProvider";
import { Loading } from "../svgs/Loading.js";

export const Playlists = () => {
  const { playlists, setPlaylists, getAllPlaylists, getUserPlaylists } =
    useContext(PlaylistContext);
  const [isLoading, setIsLoading] = useState(true);
  const [filterToggle, setFilterToggle] = useState(false);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("enchiridion_user"));
  const smImgUrl = "https://www.themoviedb.org/t/p/original";
  const placeholderImage =
    "https://via.placeholder.com/130x195.png?text=No+Image";
  const [screenSize, setScreenSize] = useState(getCurrentDimension());

  // Get current window dimensions
  function getCurrentDimension() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  // Update window dimensions on resize
  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrentDimension());
    };
    window.addEventListener("resize", updateDimension);

    return () => {
      window.removeEventListener("resize", updateDimension);
    };
  }, [screenSize]);

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

  // Make playlist image grid depending on number of episodes in playlist
  const makePlaylistImage = (playlist) => {
    const episodeImages = playlist.episodes
      .slice(0, 4)
      .map((episode) => episode.still_path);
    if (episodeImages.length <= 4 && episodeImages.length > 0) {
      return (
        <div className="flex justify-center items-center">
          <div className="w-full sm:w-1/2 md:w-full">
            <div className="grid grid-cols-2 gap-0">
              {episodeImages.map((img, index) => (
                <img
                  key={index}
                  className="w-full object-cover"
                  src={`${smImgUrl}${img}`}
                  alt="episode"
                />
              ))}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <img
          className="w-full h-full object-cover"
          src={placeholderImage}
          alt="placeholder"
        />
      );
    }
  };

  if (isLoading) {
    // Spinning wheel loading animation
    return <Loading />;
  } else if (playlists.length === 0 || playlists.detail === "Invalid token.") {
    return <h1>No playlists found</h1>;
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
            <div key={playlist.id} className="card">
              <Link to={`/playlists/${playlist.id}`}>
                {screenSize.width > 767 ? (
                  <div className="flex items-center">
                    <div className="md:w-1/2">{playlistImage}</div>
                    <div className="md:w-1/2">
                      {/* User is most likely on a desktop/tablet, show all playlist info */}
                      <div className="flex-col flex-grow p-4">
                        <div className="pt-4 text-xl text-center">
                          {playlist.name}
                        </div>
                        <div className="flex-grow pt-4 text-left text-gray-500">
                          {playlist.description.length > 200
                            ? `${playlist.description.substring(0, 200)}...`
                            : playlist.description}
                        </div>
                        <div className="pt-4 text-xs text-center text-gray-500">
                          <p>
                            {episodeCount} episodes • {printTotalRuntime}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* User is most likely on a mobile device, show playlist info without the description */}
                    {playlistImage}
                    <div className="pt-4 text-xl text-center">
                      {playlist.name}
                    </div>
                    <div className="pt-4 text-xs text-center text-gray-500">
                      <p>
                        {episodeCount} episodes • {printTotalRuntime}
                      </p>
                    </div>
                  </>
                )}
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
};