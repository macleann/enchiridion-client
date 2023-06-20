import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchContext } from "./SearchProvider";
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
                .then(() => {
                    setTimeout(setIsLoading(false), 1000)
                })
        }
    }, [searchTerms])

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


    return (
      <div className="flex items-center justify-center my-4 mx-4">
        <form className="flex flex-col w-full md:w-1/2">
          <div className="w-full sticky top-0 z-10 bg-white dark:bg-gray-800">
            <MagnifyingGlass />
            <input
              type="text"
              id="simple-search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Find a show..."
              onChange={(e) => setSearchTerms(e.target.value)}
            />
          </div>
          {isLoading ? (
            <Loading />
          ) : (
            <div className="flex flex-wrap justify-center items-start my-2">
              {searchResults.map((result) => {
                return (
                  <Link
                    to={`/search/${result.id}`}
                    key={result.id}
                    className="card"
                  >
                    {displayPoster(result)}
                    <div className="text-center text-ellipsis md:text-xl">
                      {result.name}
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
