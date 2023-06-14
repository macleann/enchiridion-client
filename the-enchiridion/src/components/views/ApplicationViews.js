import { Outlet, Route, Routes } from "react-router-dom";
import { Home } from "../home/Home";
import { Playlists } from "../playlists/Playlists";
import { Seasons } from "../seasons/Seasons";
import { SeasonDetail } from "../seasons/SeasonDetail";

export const ApplicationViews = () => {
    const localEnchiridionUser = localStorage.getItem("enchiridion_user");
    const enchiridionUserObject = JSON.parse(localEnchiridionUser);

  return (
    <>
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route path="/" element={<Home />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/playlists/:section" element={<Playlists />} />
          <Route path="/seasons" element={<Seasons />} />
          <Route path="/seasons/:seasonNumber" element={<SeasonDetail />} />
        </Route>
      </Routes>
    </>
  );
};