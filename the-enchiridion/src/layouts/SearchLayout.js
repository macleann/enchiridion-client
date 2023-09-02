import { SearchProvider } from "../providers/SearchProvider";
import { SeasonProvider } from "../providers/SeasonProvider";
import { EpisodeProvider } from "../providers/EpisodeProvider";

export const SearchLayout = ({ children }) => (
  <SearchProvider>
    <SeasonProvider>
      <EpisodeProvider>
        {children}
      </EpisodeProvider>
    </SeasonProvider>
  </SearchProvider>
);