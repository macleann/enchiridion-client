import { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SearchContext } from "../../providers/SearchProvider";
import { Loading } from "../svgs/Loading.js";
import { MagnifyingGlass } from "../svgs/MagnifyingGlass.js";

export const SearchBar = () => {
    const { searchResults, setSearchResults, getAllSearchResults } = useContext(SearchContext)
    const [searchTerms, setSearchTerms] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (searchTerms !== "") {
            setIsLoading(true)
            getAllSearchResults(searchTerms)
                .then(res => setSearchResults(res))
                .then(() => setIsLoading(false))
        }
    }, [searchTerms])

    // Function to add a delay to any given function, in this case, the search function so that it doesn't fire on every keystroke
    function debounce(func, delay) {
      let debounceTimer;
      return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
      }
    }

    // Debounce the search function
    // useCallback is used to prevent the function from being recreated on every render
    const debouncedSearch = useCallback(
      debounce((e) => setSearchTerms(e.target.value), 500),
      [],
    )

    const displayPoster = (result) => {
        if (result.poster_path !== null) {
            return <img
            src={`https://www.themoviedb.org/t/p/original${result.poster_path}`}
            alt={result.name}
            className="rounded"
          />
        } else {
            return <img
            src="https://via.placeholder.com/150x225.png?text=No+Image"
            alt={result.name}
            className="rounded"
            />
        }
    }

    const getAirDate = (result) => {
        if (result.first_air_date !== null) {
            const dateSplit = result.first_air_date.split("-");
            const year = dateSplit[0];
            return year;
        } else {
            return "N/A";
        }
    }

    if (searchResults.error) {
        console.log(searchResults.error)
        return (
        <div className="text-center">
            <h1 className="text-xl md:text-2xl">TMDB failed to respond</h1>
            <p>Don't worry, neither of us did anything wrong. It's just finnicky.</p>
            <p>Try refreshing the page and searching again.</p>
        </div>
      )
    }

    return (
      <div className="flex items-center justify-center my-4 mx-4">
        <form className="flex flex-col w-full md:w-2/3">
        <div className="w-full sticky scroll-m-0 top-[var(--navbar-height)] z-50 bg-white dark:bg-gray-800">
            <MagnifyingGlass />
            <input
              type="text"
              id="simple-search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Find a show..."
              onChange={(e) => {
                setIsLoading(true);
                debouncedSearch(e);
              }}
            />
          </div>
          {isLoading ? (
            <Loading />
          ) : (
            <div
              className={`grid grid-cols-3 xl:grid-cols-4 gap-4 my-2`}
            >
              {searchResults.map((result) => {
                return (
                  <Link
                    id={`search-result-${result.id}`}
                    to={`/search/${result.id}`}
                    key={result.id}
                    className="card-search-result"
                  >
                    {displayPoster(result)}
                    <div className="text-wrapper">
                      <div className="text-center md:text-xl">
                        {result.name}
                      </div>
                    </div>
                    <div className="text-xs md:text-sm text-gray-500">
                      {getAirDate(result)}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </form>
      </div>
    );
}