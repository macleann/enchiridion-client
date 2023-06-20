import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchContext } from "./SearchProvider";
import { Loading } from "../svgs/Loading.js";

export const SearchBar = () => {
    const { searchResults, setSearchResults, getAllSearchResults } = useContext(SearchContext)
    const [searchTerms, setSearchTerms] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const currentUser = JSON.parse(localStorage.getItem("enchiridion_user"))
    const [screenSize, setScreenSize] = useState(getCurrentDimension());
    const posterImgURL = "https://www.themoviedb.org/t/p/original"
    
    if (screenSize.width < 768) {
        const posterImgURL = "https://www.themoviedb.org/t/p/w185"
    }

    // Get current window dimensions
    function getCurrentDimension() {
        return {
        width: window.innerWidth,
        height: window.innerHeight,
        };
    }

    // Update window dimensions on resize
    useEffect(() => {
        const updateDimension = () => {
        setScreenSize(getCurrentDimension());
        };
        window.addEventListener("resize", updateDimension);

        return () => {
        window.removeEventListener("resize", updateDimension);
        };
    }, [screenSize]);

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

    return (
      <div className="flex items-center justify-center my-4 mx-4">
        <form className="flex flex-col w-full md:w-1/2">
            <div className="w-full sticky top-0 z-10 bg-white dark:bg-gray-800">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
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
                  <Link to={`/search/${result.id}`} key={result.id} className="card">
                    {displayPoster(result)}
                    <div className="text-center text-ellipsis md:text-xl">{result.name}</div>
                  </Link>
                );
              })}
            </div>
          )}
        </form>
      </div>
    );
}
