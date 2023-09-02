import { PlaylistProvider } from "../providers/PlaylistProvider";
import { EpisodeProvider } from "../providers/EpisodeProvider";

export const PlaylistLayout = ({ children }) => (
  <PlaylistProvider>
    <EpisodeProvider>
      {children}
    </EpisodeProvider>
  </PlaylistProvider>
);