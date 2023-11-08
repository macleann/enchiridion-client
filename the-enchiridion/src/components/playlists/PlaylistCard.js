import React from "react";
import { Link } from "react-router-dom";
import { useScreenSize } from "../../utils/useScreenSize";
import { makePlaylistImage } from "../../utils/makePlaylistImage.js";
import { LikeIcon } from "../svgs/LikeIcon";

export const PlaylistCard = ({ playlist }) => {
  const { isMobile } = useScreenSize();
  const episodeCount = playlist.episodes.length;
  const playlistImage = makePlaylistImage(playlist);

  const calculateTotalRuntime = (episodes) => {
    const totalRunTimeMins = episodes.reduce((runtimeAccumulator, episode) => {
      return runtimeAccumulator + parseInt(episode.runtime);
    }, 0);
    const hours = Math.floor(totalRunTimeMins / 60);
    const minutes = totalRunTimeMins % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="card-playlists">
      <Link to={`/playlists/${playlist.id}`}>
        <div className="absolute top-0 right-2 flex">
          <div className="h-4 mt-2 mr-1 text-sm text-gray-500">{playlist.likes_count}</div>
          <div className="mt-2"><LikeIcon fill="rgb(107 114 128)"/></div>
        </div>
        <div className="my-3">{playlistImage}</div>
        <div>
          <div className="my-2 text-lg md:text-xl text-center">{playlist.name}</div>
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
        <div className="absolute bottom-0 w-full my-2 text-xs text-center text-gray-500">
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
