import { useContext, useEffect, useState, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { PlaylistContext } from "../../providers/PlaylistProvider"
import { SeasonContext } from "../../providers/SeasonProvider"
import { SearchContext } from "../../providers/SearchProvider"
import { useScreenSize } from "../../utils/useScreenSize"
import { DnDEpisodeOrder } from "../dragndrop/DnDEpisodeOrder"
import { Loading } from "../svgs/Loading.js"
import { MagnifyingGlass } from "../svgs/MagnifyingGlass.js"

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
  const { searchResults, setSearchResults, getAllSearchResults } =
    useContext(SearchContext);
  const { playlistId } = useParams();
  const [focused, setFocused] = useState({
    name: false,
    description: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [show, setShow] = useState({
    id: 0,
    name: "",
    overview: "",
    poster_path: "",
    backdrop_path: "",
    seasons: [],
  });
  const [showId, setShowId] = useState(null);
  const [season, setSeason] = useState({
    id: 0,
    episodes: [],
  });
  const [seasonNumber, setSeasonNumber] = useState(null);
  const [displayShowSelect, setDisplayShowSelect] = useState(false);
  const [displaySeasonSelect, setDisplaySeasonSelect] = useState(false);
  const [displayEpisodeSelect, setDisplayEpisodeSelect] = useState(false);
  const [episodes, setEpisodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { isMobile } = useScreenSize();

  // Get playlist by id if in url
  useEffect(() => {
    if (playlistId) {
      getPlaylistById(playlistId).then((res) => setPlaylist(res));
    }
  }, [playlistId]);

  // Get search results when search term changes
  useEffect(() => {
    if (searchTerm !== "") {
      getAllSearchResults(searchTerm)
        .then((res) => setSearchResults(res))
        .then(() => setIsLoading(false));
    }
  }, [searchTerm]);

  // Get show by id
  useEffect(() => {
    if (showId !== null) {
      getAllSeasons(showId)
        .then((res) => setSeasons(res))
        .then(() => setIsLoading(false));
    }
  }, [showId]);

  // Get season by season number and show id
  useEffect(() => {
    if (seasonNumber !== null) {
      getSeasonBySeasonNumber(seasonNumber, showId).then((res) => {
        setSeason(res);
        const modifiedEpisodes = res.episodes;
        modifiedEpisodes.forEach((episode) => {
          episode.series_name = show.name;
          episode.series_id = showId;
        });
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

  // Handle reordering episodes
  const handleReorder = (newOrder) => {
    const newPlaylist = { ...playlist };
    newOrder.forEach((episode, index) => {
      episode.order_number = index + 1;
    });
    newPlaylist.episodes = newOrder;
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

  // Handle disabling the save button if required fields are not filled out
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
  };

  // Handle displaying an object's air date
  const displayAirDate = (object) => {
    if (object.first_air_date) {
      return object.first_air_date.slice(0, 4);
    } else if (object.release_date) {
      return object.release_date.slice(0, 4);
    } else if (object.air_date) {
      const date = new Date(object.air_date);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      return formattedDate;
    } else {
      return "N/A";
    }
  };

  // Debounce function for search
  function debounce(func, delay) {
    let debounceTimer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  }

  // Debounce search
  const debouncedSearch = useCallback(
    debounce((e) => setSearchTerm(e.target.value), 500),
    []
  );

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
            <fieldset>
              <div className="w-full sticky mb-6 top-0 z-10 bg-white dark:bg-gray-800">
                <MagnifyingGlass />
                <input
                  type="text"
                  id="search"
                  className="search-bar"
                  placeholder="Search for a show"
                  onChange={(event) => {
                    setDisplaySeasonSelect(false);
                    setDisplayEpisodeSelect(false);
                    debouncedSearch(event);
                    setDisplayShowSelect(true);
                  }}
                />
              </div>
            </fieldset>
            <fieldset
              style={{
                visibility: displayShowSelect ? "visible" : "hidden",
              }}
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <Loading />
                </div>
              ) : (
                <select
                  id="show"
                  className="mb-6 select w-full max-w-xs"
                  onChange={(event) => {
                    const selectedShow = searchResults.find(
                      (result) => result.id === parseInt(event.target.value)
                    );
                    setShow(selectedShow);
                    setShowId(selectedShow.id);
                    setDisplaySeasonSelect(true);
                  }}
                >
                  <option value="0">Select a show</option>
                  {searchResults.map((result) => {
                    return (
                      <option id={result.id} key={result.id} value={result.id}>
                        {result.name} ({displayAirDate(result)})
                      </option>
                    );
                  })}
                </select>
              )}
            </fieldset>
            <fieldset
              style={{
                visibility: displaySeasonSelect ? "visible" : "hidden",
              }}
            >
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
                    setDisplayEpisodeSelect(true);
                  } else {
                    setDisplayEpisodeSelect(false);
                  }
                }}
              >
                <option value="0">Select a season</option>
                {seasons.map((season) => {
                  return (
                    <option id={season.id} key={season.id} value={season.id}>
                      {season.name}
                    </option>
                  );
                })}
              </select>
            </fieldset>
            <fieldset
              style={{
                visibility: displayEpisodeSelect ? "visible" : "hidden",
              }}
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
              <DnDEpisodeOrder
                episodes={playlist.episodes}
                onReorder={handleReorder}
                handleRemoveEpisode={handleRemoveEpisode}
                displayAirDate={displayAirDate}
                isMobile={isMobile}
              />
            </fieldset>
            <button
              id="save-playlist"
              className={
                !playlist.name || !playlist.description || !playlist.episodes
                  ? "button-primary-disabled"
                  : "button-primary"
              }
              onClick={
                !playlist.name || !playlist.description || !playlist.episodes
                  ? handleDisabledSave
                  : handleSavePlaylist
              }
              disabled={!playlist.name || !playlist.description || !playlist.episodes}
            >
              Save Playlist
            </button>
          </form>
        </section>
      </main>
    </>
  );
}