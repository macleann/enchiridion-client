import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useScreenSize } from "../../utils/useScreenSize";
import { makePlaylistImage } from "../../utils/makePlaylistImage.js";
import { LikeIcon } from "../svgs/LikeIcon";
import { PlaylistContext } from "../../providers/PlaylistProvider.js";
import { useSelector, useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/actions/snackbarActions";
import { trigger } from "../../redux/actions/utilityActions.js";

export const PlaylistCard = ({ playlist }) => {
  const { likePlaylist, unlikePlaylist } = useContext(PlaylistContext)
  const { isMobile } = useScreenSize();
  const episodeCount = playlist.episodes.length;
  const playlistImage = makePlaylistImage(playlist);
  const currentUser = useSelector((state) => state.auth.userData);
  const [likesCount, setLikesCount] = useState(playlist.likes_count);
  const dispatch = useDispatch();

  const calculateTotalRuntime = (episodes) => {
    const totalRunTimeMins = episodes.reduce((runtimeAccumulator, episode) => {
      return runtimeAccumulator + parseInt(episode.runtime);
    }, 0);
    const hours = Math.floor(totalRunTimeMins / 60);
    const minutes = totalRunTimeMins % 60;
    return `${hours}h ${minutes}m`;
  };

  const handleLike = (playlist) =>  {
    if (!currentUser.id) {
      dispatch(showSnackbar("You must be logged in", "error"))
    }
    else {
      if (playlist.is_liked) {
        unlikePlaylist(playlist.id)
        setLikesCount(likesCount - 1)
        playlist.likes_count = likesCount - 1;
        playlist.is_liked = false
        dispatch(trigger("update"))
        return playlist
      }
      else {
        likePlaylist(playlist.id)
        setLikesCount(likesCount + 1)
        playlist.likes_count = likesCount + 1;
        playlist.is_liked = true
        dispatch(trigger("update"))
        return playlist
      }
    }
  }

  useEffect(() => {
    setLikesCount(playlist.likes_count);
  }, [playlist.likes_count]);

  return (
    <div className="card-playlists">
      <div className="absolute top-0 right-2 flex">
          <div className="h-4 mt-2 mr-1 text-sm text-gray-500">{likesCount}</div>
          <div onClick={() => handleLike(playlist)} className="mt-2 w-4"><LikeIcon fill={playlist.is_liked ? "rgb(107 114 128)" : "rgb(156 163 175)" }/></div>
      </div>
      <Link to={`/playlists/${playlist.id}`}>
        <div className="my-3">{playlistImage}</div>
        <div className="mb-6">
          <div id="playlist-title" className="my-2 text-lg md:text-xl text-center">{playlist.name}</div>
          {isMobile ? null : (
            <div className="mx-4 my-2 text-center text-gray-500">
              {playlist.description.length > 100 ? (
                <p>{playlist.description.slice(0, 100)}...</p>
              ) : (
                <p>{playlist.description}</p>
              )}
            </div>
          )}
        </div>
        <div className="absolute my-2 bottom-0 left-1/2 transform -translate-x-1/2 text-xs text-center text-gray-500">
          {isMobile ? (
            <p>
              {episodeCount} eps • {calculateTotalRuntime(playlist.episodes)}
            </p>
          ) : (
            <p>
              {episodeCount} episodes •{" "}
              {calculateTotalRuntime(playlist.episodes)}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};
