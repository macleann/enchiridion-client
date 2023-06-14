import { AuthProvider } from "./auth/AuthProvider";
import { PlaylistProvider } from "./playlists/PlaylistProvider";
import { SeasonProvider } from "./seasons/SeasonProvider";

export const GodProvider = (props) => {
  return (
    <>
      <AuthProvider>
        <PlaylistProvider>
          <SeasonProvider>
            {props.children}
          </SeasonProvider>
        </PlaylistProvider>
      </AuthProvider>
    </>
  );
};