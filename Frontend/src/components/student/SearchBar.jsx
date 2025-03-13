import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ data }) => {
  const [input, setInput] = useState(data ? data : "");
  const navigate = useNavigate();
  const onSearchHandler = (e) => {
    e.preventDefault();
    navigate("/course-list/" + input);
  };
  return (
    <form
      onSubmit={onSearchHandler}
      className="max-w-xl w-full md:h-14 h-12 flex items-center bg-white border border-gray-500/20 rounded"
    >
      <img
        className="md:w-auto w-10 px-3 "
        src={assets.search_icon}
        alt="search_icon"
      />
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search for courses"
        className="w-full h-full outline-none text-gray-500/80"
      />
      <button
        type="submit"
        className="bg-blue-600 rounded text-white md:px-10 px-7 md:py-3 py-2 mx-1 cursor-pointer"
      >
        Submit
      </button>
    </form>
  );
};

export default SearchBar;
