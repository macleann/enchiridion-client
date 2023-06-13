import { AuthProvider } from "./auth/AuthProvider";
import { PlaylistProvider } from "./playlists/PlaylistProvider";

export const GodProvider = (props) => {
  return (
    <>
      <AuthProvider>
        <PlaylistProvider>
          {props.children}
        </PlaylistProvider>
      </AuthProvider>
    </>
  );
};