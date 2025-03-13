import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";

import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const NavBar = () => {
  const isCourseListPage = location.pathname.includes("/course-list");
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const { isEducator } = useContext(AppContext);
  return (
    <div
      className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-400 py-4 ${
        isCourseListPage ? "bg-white" : "bg-cyan-100/70"
      }`}
    >
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="w-20 lg:w-32 cursor-pointer"
      />
      <div className="hidden md:flex items-center gap-5 text-gray-500">
        <div className="flex items-center gap-5">
          {user && (
            <>
              <button
                className="cursor-pointer"
                onClick={() => {
                  navigate("/educator");
                }}
              >
                {isEducator ? "Educator Dashboard" : "Become Educator"}
              </button>
              |<Link to={"/my-enrollments"}>My enrollments</Link>
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="bg-blue-600 text-white px-5 py-2 rounded-full"
          >
            Create Account
          </button>
        )}
      </div>
      {/* for phone screen */}
      <div className="md:hidden flex items-center gap-2 sm:gap-5 text-gray-500">
        <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
          {user && (
            <>
              <button
                onClick={() => {
                  navigate("/educator");
                }}
              >
                {isEducator ? "Educator Dashboard" : "Become Educator"}
              </button>
              <Link to={"/my-enrollments"}>My enrollments</Link>
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button className="" onClick={() => openSignIn()}>
            <img src={assets.user_icon} alt="" />
          </button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
