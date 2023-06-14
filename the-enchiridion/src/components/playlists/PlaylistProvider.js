import { createContext, useState } from "react"

export const PlaylistContext = createContext()

export const PlaylistProvider = (props) => {
    const [playlists, setPlaylists] = useState([])
    const url = "http://localhost:8000"
    const currentUser = JSON.parse(localStorage.getItem("enchiridion_user"))
    if (currentUser?.token) {
        currentUser.token = currentUser.token.replace(/['"]+/g, '')
    }

    const getAllPlaylists = () => {
        return fetch(`${url}/playlists`).then(res => res.json())
    }

    const getUserPlaylists = () => {
        return fetch(`${url}/user-playlists`, {
            headers: {
                "Authorization": `Token ${currentUser.token}`
            }
        }).then(res => res.json())
    }

    const getPlaylistById = (id) => {
        return fetch(`${url}/playlists/${id}`).then(res => res.json())
    }

    const createPlaylist = (playlist) => {
        return fetch(`${url}/user-playlists`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${currentUser.token}`
            },
            body: JSON.stringify(playlist)
        }).then(res => res.json())
    }

    const updatePlaylist = (playlist) => {
        return fetch(`${url}/user-playlists/${playlist.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${currentUser.token}`
            },
            body: JSON.stringify(playlist)
        }).then(res => res.json())
    }

    const deletePlaylist = (id) => {
        return fetch(`${url}/user-playlists/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Token ${currentUser.token}`
            }
        })
    }

    return (
        <PlaylistContext.Provider value={{
            playlists, setPlaylists, getAllPlaylists, getUserPlaylists, getPlaylistById, createPlaylist, updatePlaylist, deletePlaylist
        }}>
            {props.children}
        </PlaylistContext.Provider>
    )
}