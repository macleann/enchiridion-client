import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const navBar = document.querySelector('#navBar');
    const height = navBar.offsetHeight;
    document.documentElement.style.setProperty('--navbar-height', `${height}px`);
  }, [isOpen]);
  

  const handleLogout = () => {
    localStorage.removeItem("enchiridion_user");
    navigate("/", { replace: true });
    window.alert("You've been logged out.");
    setIsOpen(false);
  };

  const handleClick = () => setIsOpen(false);

  return (
    <div id="navBar" className="md:flex md:items-center p-5 bg-white bg-opacity-50">
      <div className="flex justify-between items-center">
        <Link to="/">
          <img className="w-16 h-auto" src="/Enchiridion.png" alt="Enchiridion" />
        </Link>
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {/* Hamburger Icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
      <div className={`${isOpen ? 'block' : 'hidden'} md:flex md:w-full md:justify-between`}>
        <div className="md:justify-start md:ml-4">
          <Link to="/playlists" onClick={handleClick} className="block mt-4 ml-2 md:inline-block md:mt-0 mr-6 font-bold">Playlists</Link>
          <Link to="/search" onClick={handleClick} className="block mt-4 ml-2 md:inline-block md:mt-0 mr-6 font-bold">Search Shows</Link>
        </div>
        <div className="md:justify-end md:mr-4">
          {localStorage.getItem("enchiridion_user") ? (
            <button onClick={handleLogout} className="block mt-4 ml-2 md:inline-block md:mt-0 font-bold">Logout</button>
          ) : (
            <Link to="/login" className="block mt-4 md:inline-block md:mt-0 font-bold">Login</Link>
          )}
        </div>
      </div>
    </div>
  );
};
