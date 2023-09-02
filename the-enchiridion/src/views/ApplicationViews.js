import { Outlet, Route, Routes } from "react-router-dom";
import { Home } from "../components/home/Home";
import { Playlists } from "../components/playlists/Playlists";
import { PlaylistDetail } from "../components/playlists/PlaylistDetail";
import { PlaylistForm } from "../components/playlists/PlaylistForm";
import { SeasonDetail } from "../components/seasons/SeasonDetail";
import { EpisodeDetail } from "../components/episodes/EpisodeDetail";
import { SearchBar } from "../components/search/SearchBar";
import { SearchDetail } from "../components/search/SearchDetail";
import { PlaylistLayout } from "../layouts/PlaylistLayout";
import { SearchLayout } from "../layouts/SearchLayout";

export const ApplicationViews = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/playlists/:playlistId/:episodeId"
            element={
              <PlaylistLayout>
                <EpisodeDetail />
              </PlaylistLayout>
            }
          />
          <Route
            path="/playlists/:playlistId"
            element={
              <PlaylistLayout>
                <PlaylistDetail />
              </PlaylistLayout>
            }
          />
          <Route
            path="/playlists"
            element={
              <PlaylistLayout>
                <Playlists />
              </PlaylistLayout>
            }
          />
          <Route
            path="/playlists/create"
            element={
              <PlaylistLayout>
                <SearchLayout>
                  <PlaylistForm />
                </SearchLayout>
              </PlaylistLayout>
            }
          />
          <Route
            path="/playlists/:playlistId/edit"
            element={
              <PlaylistLayout>
                <SearchLayout>
                  <PlaylistForm />
                </SearchLayout>
              </PlaylistLayout>
            }
          />
          <Route
            path="/search"
            element={
              <SearchLayout>
                <SearchBar />
              </SearchLayout>
            }
          />
          <Route
            path="/search/:resultId"
            element={
              <SearchLayout>
                <SearchDetail />
              </SearchLayout>
            }
          />
          <Route
            path="/search/:resultId/season/:seasonNumber"
            element={
              <SearchLayout>
                <SeasonDetail />
              </SearchLayout>
            }
          />
          <Route
            path="/search/:resultId/season/:seasonNumber/episode/:episodeNumber"
            element={
              <SearchLayout>
                <EpisodeDetail />
              </SearchLayout>
            }
          />
        </Route>
      </Routes>
    </>
  );
};