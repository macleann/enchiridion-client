import { Outlet, Route, Routes } from "react-router-dom";
import { Home } from "../home/Home";

export const ApplicationViews = () => {
    const localEnchiridionUser = localStorage.getItem("enchiridion_user");
    const enchiridionUserObject = JSON.parse(localEnchiridionUser);

  return (
    <>
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </>
  );
};