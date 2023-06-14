import { Outlet, Route, Routes } from "react-router-dom";
import { Home } from "../home/Home";
import { Playlists } from "../playlists/Playlists";
import { PlaylistDetail } from "../playlists/PlaylistDetail";
import { PlaylistForm } from "../playlists/PlaylistForm";
import { Seasons } from "../seasons/Seasons";
import { SeasonDetail } from "../seasons/SeasonDetail";
import { EpisodeDetail } from "../episodes/EpisodeDetail";

export const ApplicationViews = () => {
    const localEnchiridionUser = localStorage.getItem("enchiridion_user");
    const enchiridionUserObject = JSON.parse(localEnchiridionUser);

  return (
    <>
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route path="/" element={<Home />} />
          <Route path="/playlists/:playlistId/:episodeId" element={<EpisodeDetail />} />
          <Route path="/playlists/:playlistId" element={<PlaylistDetail />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/playlists/create" element={<PlaylistForm />} />
          <Route path="/seasons/:seasonNumber/episodes/:episodeNumber" element={<EpisodeDetail />} />
          <Route path="/seasons/:seasonNumber" element={<SeasonDetail />} />
          <Route path="/seasons" element={<Seasons />} />
        </Route>
      </Routes>
    </>
  );
};