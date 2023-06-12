import { Route, Routes } from "react-router-dom";
import { Login } from "./auth/Login";
import { Register } from "./auth/Register";
import { GodProvider } from "./GodProvider";
import { NavBar } from "./nav/NavBar";
import { ApplicationViews } from "./views/ApplicationViews";

export const Enchiridion = () => {
  return (
    <GodProvider>
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
    </GodProvider>
  );
};
