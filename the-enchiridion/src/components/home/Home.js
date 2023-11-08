import { useState, useContext, useEffect } from "react";
import { useScreenSize } from "../../utils/useScreenSize.js";
import { PlaylistContext } from "../../providers/PlaylistProvider.js";
import { PlaylistCard } from "../playlists/PlaylistCard";
import { Loading } from "../svgs/Loading.js";

export const Home = () => {
  const { playlists, setPlaylists, getAllPlaylists, getTrendingPlaylists } =
    useContext(PlaylistContext);
  const [trendingPlaylists, setTrendingPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllPlaylists()
      .then((res) => setPlaylists(res))
      .then(() => {
        setTimeout(() => setIsLoading(false), 500);
      });
    getTrendingPlaylists(7)
      .then((res) => setTrendingPlaylists(res))
      .then(() => {
        setTimeout(() => setIsLoading(false), 500);
      });
  }, []);

  if (isLoading) {
    // Spinning wheel loading animation
    return <Loading />;
  } else if (playlists.length === 0 || playlists.detail === "Invalid token.") {
    return <h1 className="my-4 text-2xl">No playlists found</h1>;
  }
  return (
    <>
      <div className="flex flex-col">
        <h2 className="mt-8 ml-12 text-2xl">Trending Playlists</h2>
        <div className="scrolling-wrapper">
          {trendingPlaylists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </div>
      <div className="flex flex-col">
        <h2 className="mt-8 ml-12 text-2xl">Most Liked Playlists</h2>
        <div className="scrolling-wrapper">
          {playlists
            .sort((a, b) => b.likes_count - a.likes_count)
            .slice(0, 9)
            .map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
        </div>
      </div>
    </>
  );
};
