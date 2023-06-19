import { useContext, useEffect, useState, Fragment } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { PlaylistContext } from "./PlaylistProvider"
import { SeasonContext } from "../seasons/SeasonProvider"
import { Loading } from "../svgs/Loading.js"
import { TrashIcon } from "../svgs/TrashIcon.js"

export const PlaylistForm = () => {
  const [playlist, setPlaylist] = useState({
    name: "",
    description: "",
    episodes: [],
  });
  const { getPlaylistById, createPlaylist, updatePlaylist } =
    useContext(PlaylistContext);
  const { seasons, setSeasons, getAllSeasons, getSeasonBySeasonNumber } =
    useContext(SeasonContext);
  const { playlistId } = useParams();
  const [focused, setFocused] = useState({
    name: false,
    description: false,
  });
  const [season, setSeason] = useState({
    id: 0,
    episodes: [],
  });
  const [seasonNumber, setSeasonNumber] = useState(null);
  const [showEpisodeSelect, setShowEpisodeSelect] = useState(false);
  const [episodes, setEpisodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [screenSize, setScreenSize] = useState(getCurrentDimension());
  const episodeimgURL = "https://www.themoviedb.org/t/p/original"

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

  // Get all seasons on page load
  useEffect(() => {
    getAllSeasons()
      .then((res) => setSeasons(res))
      .then(() => setIsLoading(false));
  }, []);

  // Get playlist by id if in url
  useEffect(() => {
    if (playlistId) {
      getPlaylistById(playlistId).then((res) => setPlaylist(res));
    }
  }, [playlistId]);

  // Get season by season number
  useEffect(() => {
    if (seasonNumber !== null) {
      getSeasonBySeasonNumber(seasonNumber).then((res) => {
        setSeason(res);
        const modifiedEpisodes = res.episodes;
        modifiedEpisodes.map((episode) => (episode.series_id = 15260));
        setEpisodes(modifiedEpisodes);
      });
    }
  }, [seasonNumber]);

  // Handle changes to playlist state from form inputs
  const handleControlledInputChange = (event) => {
    event.preventDefault();
    const newPlaylist = { ...playlist };
    newPlaylist[event.target.id] = event.target.value;
    setPlaylist(newPlaylist);
  };

  // Handle adding an episode to the playlist
  const handleAddEpisode = (event) => {
    event.preventDefault();
    const newPlaylist = { ...playlist };
    const selectedEpisode = episodes.find(
      (episode) => episode.id === parseInt(event.target.value)
    );
    selectedEpisode.order_number = newPlaylist.episodes.length + 1;
    newPlaylist.episodes.push(selectedEpisode);
    setPlaylist(newPlaylist);
  };

  // Handle removing an episode from playlist
  const handleRemoveEpisode = (event) => {
    event.preventDefault();
    const newPlaylist = { ...playlist };
    const episodeIndex = newPlaylist.episodes.findIndex(
      (episode) => episode.id === parseInt(event.target.value)
    );
    newPlaylist.episodes.splice(episodeIndex, 1);
    setPlaylist(newPlaylist);
  };

  // Handle the css class for the input label
  const handleFocus = (field, isFocused) => {
    setFocused({ ...focused, [field]: isFocused });
  };

  // Also handle the css class for the input label
  const isFocusedOrFilled = (field, value) => {
    return focused[field] || value
      ? "transform -translate-y-[1.15rem] scale-[0.8] text-primary"
      : "";
  };

  // Handle saving the playlist
  const handleSavePlaylist = (event) => {
    event.preventDefault();
    if (playlistId) {
      // update
      updatePlaylist(playlist).then(() => {
        navigate(`/playlists/${playlistId}`);
      });
    } else {
      // create
      createPlaylist(playlist).then(() => {
        navigate("/playlists");
      });
    }
  };

  const handleDisabledSave = (event) => {
    event.preventDefault();
    const isDisabled = {
      name: false,
      description: false,
      episodes: false,
    };
    if (playlist.name === "") {
      isDisabled.name = true;
    }
    if (playlist.description === "") {
      isDisabled.description = true;
    }
    if (playlist.episodes.length === 0) {
      isDisabled.episodes = true;
    }
    return window.alert(
      "Please fill out all fields and add at least one episode to the playlist before saving."
    );
  }


  if (isLoading) {
    // If loading, show the spinning loading animation
    return <Loading />;
  }
  return (
    <>
      <main>
        <section className="flex md:mx-4 my-2 justify-center items-center">
          <form className="border-2 border-none rounded-lg shadow-md p-4 backdrop-blur-sm w-3/4 md:w-full">
            <h1 className="relative mb-3 text-center text-xl">
              {playlistId ? "Edit Playlist" : "Create Playlist"}
            </h1>
            <fieldset className="relative mb-6 group">
              <label
                className={`input-label ${isFocusedOrFilled(
                  "name",
                  playlist.name
                )} motion-reduce:transition-none`}
                htmlFor="name"
              >
                Name:
              </label>
              <input
                type="text"
                id="name"
                className="input-field"
                value={playlist.name}
                placeholder="Bad Dads"
                onChange={handleControlledInputChange}
                onFocus={() => handleFocus("name", true)}
                onBlur={(evt) => handleFocus("name", evt.target.value !== "")}
              />
            </fieldset>
            <fieldset className="relative mb-6 group">
              <label
                className={`input-label ${isFocusedOrFilled(
                  "description",
                  playlist.description
                )} motion-reduce:transition-none`}
                htmlFor="description"
              >
                Description:
              </label>
              <input
                type="text"
                id="description"
                className="input-field"
                value={playlist.description}
                placeholder="A masterclass in bad parenting"
                onChange={handleControlledInputChange}
                onFocus={() => handleFocus("description", true)}
                onBlur={(evt) =>
                  handleFocus("description", evt.target.value !== "")
                }
              />
            </fieldset>
            <fieldset></fieldset>
            <fieldset>
              <select
                id="season"
                className="mb-6 select w-full max-w-xs"
                onChange={(event) => {
                  const selectedSeason = seasons.find(
                    (season) => season.id === parseInt(event.target.value)
                  );
                  setSeasonNumber(selectedSeason.season_number);

                  // If a valid season is selected, show the episode select
                  if (selectedSeason.id !== 0) {
                    setShowEpisodeSelect(true);
                  } else {
                    setShowEpisodeSelect(false);
                  }
                }}
              >
                <option value="0">Select a season</option>
                {seasons.map((season) => {
                  return (
                    <option key={season.id} value={season.id}>
                      {season.name}
                    </option>
                  );
                })}
              </select>
            </fieldset>
            <fieldset
              style={{ visibility: showEpisodeSelect ? "visible" : "hidden" }}
            >
              <select
                id="episode"
                className="mb-6 select-sm md:select w-full max-w-xs"
                onChange={handleAddEpisode}
              >
                <option value="0">Select an episode</option>
                {episodes?.map((episode) => {
                  return (
                    <option key={episode.id} value={episode.id}>
                      {episode.name}
                    </option>
                  );
                })}
              </select>
            </fieldset>
            <fieldset>
              <ol>
                {playlist.episodes
                  .sort((episode) => episode.order_number)
                  .map((episode) => {
                    return (
                      <li key={episode.id} className="my-4">
                        {screenSize.width > 768 ? ( // If the screen size is larger than 768px (typically considered a desktop view)
                          <div className="grid grid-cols-3 items-start gap-4">
                            <div className="col-span-1">
                              <img
                                src={`${episodeimgURL}${episode.still_path}`}
                                alt={episode.name}
                                className="w-full h-auto"
                              />
                            </div>
                            <div className="col-span-1">
                              <h2 className="font-bold text-xl">
                                {episode.name}
                              </h2>
                              <p className="text-sm">
                                Season {episode.season_number} Episode{" "}
                                {episode.episode_number}
                              </p>
                              <p className="text-sm text-gray-500">
                                {episode.overview}
                              </p>
                              <p className="text-sm text-gray-500">
                                {episode.air_date}
                              </p>
                            </div>
                            <div className="col-span-1 flex items-start justify-end">
                              <button
                                className="button-delete bg-white hover:bg-red-500 text-black hover:text-white"
                                value={episode.id}
                                onClick={handleRemoveEpisode}
                              >
                                <TrashIcon />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div>
                              <h2 className="font-bold text-xl">
                                {episode.name}
                              </h2>
                              <p className="text-sm text-gray-500">
                                Season {episode.season_number} Episode{" "}
                                {episode.episode_number}
                              </p>
                            </div>
                            <button
                              className="button-delete bg-white hover:bg-red-500 text-black hover:text-white"
                              value={episode.id}
                              onClick={handleRemoveEpisode}
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        )}
                      </li>
                    );
                  })}
              </ol>
            </fieldset>
            <button
              className={
                !playlist.name || !playlist.description || !playlist.episodes
                  ? "button-primary-disabled"
                  : "button-primary"
              }
              onClick={!playlist.name || !playlist.description || !playlist.episodes ? handleDisabledSave : handleSavePlaylist}
            >
              Save Playlist
            </button>
          </form>
        </section>
      </main>
    </>
  );
}