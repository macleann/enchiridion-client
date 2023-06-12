import { Link, useNavigate } from "react-router-dom";

export const NavBar = () => {
  const navigate = useNavigate();
  const localEnchiridionUser = localStorage.getItem("enchiridion_user");
  const enchiridionUserObject = JSON.parse(localEnchiridionUser);

  return (
    <ul className="flex items-center">
      <li className="p-3">
        <Link to="/">Home</Link>
      </li>
      <li className="p-3 font-bold hover:underline decoration-wavy">
        <Link to="/all-playlists">All Playlists</Link>
      </li>
      <li className="p-3 font-bold hover:underline decoration-wavy">
        <Link to="/my-playlists">My Playlists</Link>
      </li>
      <li className="p-3 font-bold hover:underline decoration-wavy">
        <Link to="/seasons">Seasons</Link>
      </li>
      {localStorage.getItem("enchiridion_user") ? (
        <li className="ml-auto mr-2 p-3 font-bold hover:underline decoration-wavy">
          <Link
            to=""
            onClick={() => {
              localStorage.removeItem("enchiridion_user");
              navigate("/", { replace: true });
              window.alert("You've been logged out.")
            }}
          >
            Logout
          </Link>
        </li>
      ) : (
        <li className="ml-auto mr-2 p-3 font-bold hover:underline decoration-wavy">
          <Link to="/login">Login</Link>
        </li>
      )}
    </ul>
  );
};