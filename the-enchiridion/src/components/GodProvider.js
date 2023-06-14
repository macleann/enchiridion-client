import { AuthProvider } from "./auth/AuthProvider";
import { EpisodeProvider } from "./episodes/EpisodeProvider";
import { PlaylistProvider } from "./playlists/PlaylistProvider";
import { SeasonProvider } from "./seasons/SeasonProvider";

export const GodProvider = (props) => {
  return (
    <>
      <AuthProvider>
        <PlaylistProvider>
          <SeasonProvider>
            <EpisodeProvider>
              {props.children}
            </EpisodeProvider>
          </SeasonProvider>
        </PlaylistProvider>
      </AuthProvider>
    </>
  );
};