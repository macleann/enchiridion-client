import { AuthProvider } from "./auth/AuthProvider";
import { EpisodeProvider } from "./episodes/EpisodeProvider";
import { PlaylistProvider } from "./playlists/PlaylistProvider";
import { SeasonProvider } from "./seasons/SeasonProvider";
import { SearchProvider } from "./search/SearchProvider";

export const GodProvider = (props) => {
  return (
    <>
      <AuthProvider>
        <PlaylistProvider>
          <SearchProvider>
            <SeasonProvider>
              <EpisodeProvider>
                {props.children}
              </EpisodeProvider>
            </SeasonProvider>
          </SearchProvider>
        </PlaylistProvider>
      </AuthProvider>
    </>
  );
};