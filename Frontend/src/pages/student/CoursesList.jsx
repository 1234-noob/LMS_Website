import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../../components/student/Footer";
import { AppContext } from "../../context/AppContext";
import CourseCard from "../../components/student/CourseCard";
import SearchBar from "../../components/student/SearchBar";
import { assets } from "../../assets/assets";
const CoursesList = () => {
  const navigate = useNavigate();
  const { allCourses } = useContext(AppContext);
  const { input } = useParams();

  const [filteredCourse, setFilteredCourse] = useState([]);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice();

      input
        ? setFilteredCourse(
            tempCourses.filter((course) =>
              course.courseTitle.toLowerCase().includes(input.toLowerCase())
            )
          )
        : setFilteredCourse(tempCourses);
    }
  }, [allCourses, input]);

  return (
    <>
      <div className="relative md:px-36 px-8 pt-20 text-left">
        <div className="flex md:flex-row flex-col gap-6 items-start justify-between w-full">
          <div>
            <h1 className="text-4xl font-semibold text-gray-800">
              Course List{" "}
            </h1>
            <p className="text-gray-500 ">
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => navigate("/")}
              >
                Home
              </span>{" "}
              / <span>Course List</span>
            </p>
          </div>
          <SearchBar data={input} />
        </div>
        {input && (
          <div className="inline-flex items-center gap-4 px-4 py-2 border mt-8 -mb-9 text-gray-600">
            {" "}
            <p>{input}</p>
            <img
              onClick={() => navigate("/course-list")}
              src={assets.cross_icon}
              alt=""
              className="cursor-pointer"
            />
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-3 px-2 md:px-0">
          {filteredCourse.map((course, i) => (
            <CourseCard key={i} course={course} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CoursesList;
