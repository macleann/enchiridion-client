import { Route, Routes } from "react-router-dom";
import { Login } from "./auth/Login";
import { Register } from "./auth/Register";
import { NavBar } from "./nav/NavBar";
import { ApplicationViews } from "../views/ApplicationViews";
import { GlobalSnackbar } from "../utils/GlobalSnackbar";
import { AuthContext } from "../providers/AuthProvider";
import { useContext, useEffect } from "react";

export const Enchiridion = () => {
  const { verifyAuthentication } = useContext(AuthContext);
  useEffect(() => {
    verifyAuthentication();
  }, []);

  return (
    <>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="*"
            element={
              <>
                <div className="flex flex-col min-h-screen">
                  <nav className="sticky top-0 z-50 bg-white/50 backdrop-blur-md">
                    <NavBar />
                  </nav>
                  <div className="relative flex-grow pb-24">
                    <ApplicationViews />
                  </div>
                </div>
              </>
            }
          />
        </Routes>
    <GlobalSnackbar />
    </>
  );
};
