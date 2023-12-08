import { createContext, useState } from "react";

export const PlaylistContext = createContext();

export const PlaylistProvider = (props) => {
  const [playlists, setPlaylists] = useState([]);
  const url = process.env.API_URL;

  const getOptions = {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  const postPutDeleteOptions = (method, body) => ({
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const getAllPlaylists = () => {
    return fetch(`${url}/playlists`, getOptions)
      .then((res) => res.json())
      .catch((err) => console.log(err));
  };

  const getUserPlaylists = () => {
    return fetch(`${url}/user-playlists`, getOptions)
      .then((res) => res.json())
      .catch((err) => console.log(err));
  };

  const getTrendingPlaylists = (days) => {
    return fetch(`${url}/playlists?trending=true&days=${days}`, getOptions)
      .then((res) => res.json())
      .catch((err) => console.log(err));
  }

  const getPlaylistById = (id) => {
    return fetch(`${url}/playlists/${id}`, getOptions)
      .then((res) => res.json())
      .catch((err) => console.log(err));
  };

  const createPlaylist = (playlist) => {
    return fetch(
      `${url}/user-playlists`,
      postPutDeleteOptions("POST", playlist)
    )
      .then((res) => res.json())
      .catch((err) => console.log(err));
  };

  const updatePlaylist = (playlist) => {
    return fetch(
      `${url}/user-playlists/${playlist.id}`,
      postPutDeleteOptions("PUT", playlist)
    )
      .then((res) => res.json())
      .catch((err) => console.log(err));
  };

  const deletePlaylist = (id) => {
    return fetch(
      `${url}/user-playlists/${id}`,
      postPutDeleteOptions("DELETE")
    ).catch((err) => console.log(err));
  };

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        setPlaylists,
        getAllPlaylists,
        getUserPlaylists,
        getTrendingPlaylists,
        getPlaylistById,
        createPlaylist,
        updatePlaylist,
        deletePlaylist,
      }}
    >
      {props.children}
    </PlaylistContext.Provider>
  );
};