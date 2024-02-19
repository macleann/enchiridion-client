import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showSnackbar } from "../../redux/actions/snackbarActions";
import { setLoggedOut } from "../../redux/actions/authActions";
import { AuthContext } from "../../providers/AuthProvider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

const NavItem = ({ text, action }) => (
  <ListItem disablePadding>
    <ListItemButton onClick={action}>
      <ListItemText primary={text} />
    </ListItemButton>
  </ListItem>
);

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { postLogout } = useContext(AuthContext);

  useEffect(() => {
    const navBar = document.querySelector("#navBar");
    const height = navBar.offsetHeight;
    document.documentElement.style.setProperty(
      "--navbar-height",
      `${height}px`
    );
  }, [isOpen]);

  const handleLogout = () => {
    postLogout().then((response) => {
      dispatch(setLoggedOut());
      dispatch(showSnackbar("Logged out successfully", "success"));
      navigate("/", { replace: true });
      setIsOpen(false);
    });
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsOpen(open);
  };

  const navActions = [
    { text: "Playlists", action: () => navigate("/playlists") },
    { text: "Search Shows", action: () => navigate("/search") },
    isLoggedIn ? { text: "Logout", action: handleLogout } : { text: "Login", action: () => navigate("/login") }
  ];

  return (
    <div
      id="navBar"
      className="md:flex md:items-center p-5 bg-white bg-opacity-50"
    >
      <div className="flex justify-between items-center">
        <Link to="/">
          <img
            className="w-16 h-auto"
            src="/Enchiridion.png"
            alt="Enchiridion"
          />
        </Link>
        <button id="hamburgerIcon" onClick={toggleDrawer(true)} className="md:hidden">
          {/* Hamburger Icon */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
        <Drawer id="hamburgerMenu" anchor="right" open={isOpen} onClose={toggleDrawer(false)}>
          <div role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
            <List>
              {navActions.map((item, index) => (
                <NavItem key={index} text={item.text} action={item.action} />
              ))}
            </List>
          </div>
        </Drawer>
      </div>
      <div className="hidden md:flex md:w-full md:justify-between">
        <div className="md:justify-start md:ml-4">
          <Link
            to="/playlists"
            className="block mt-4 ml-2 md:inline-block md:mt-0 mr-6 font-bold"
          >
            Playlists
          </Link>
          <Link
            to="/search"
            className="block mt-4 ml-2 md:inline-block md:mt-0 mr-6 font-bold"
          >
            Search Shows
          </Link>
        </div>
        <div className="md:justify-end md:mr-4">
          { isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="block mt-4 ml-2 md:inline-block md:mt-0 font-bold"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="block mt-4 md:inline-block md:mt-0 font-bold"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};