import React, { useEffect, useState, useContext } from "react";
import Loading from "../../components/student/Loading";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const StudentsEnrolled = () => {
  const { backendUrl, getToken, isEducator } = useContext(AppContext);
  const [enrolledStudents, setEnrolledStudents] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        `${backendUrl}/api/educator/enrolled-students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setEnrolledStudents(data.enrolledStudents.reverse());
        setStudentData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEnrolledStudents();
    }
  }, [enrolledStudents, isEducator]);

  return enrolledStudents ? (
    <div className="min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
        <table className="table-fixed md:table-auto w-full overflow-hidden pb-4">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">
                #
              </th>
              <th className="px-4 py-3 font-semibold ">Student Name</th>
              <th className="px-4 py-3 font-semibold ">Course Title</th>
              <th className="px-4 py-3 font-semibold ">Date</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-500">
            {enrolledStudents.map((student, ind) => (
              <tr key={ind} className="border-b border-gray-500/20 ">
                <td className="px-4 py-3 text-center hidden sm:table-cell">
                  {ind + 1}
                </td>
                <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                  <img
                    src={studentData[ind].imageUrl}
                    alt=""
                    className="w-9 h-9 rounded-full"
                  />
                  <span className="truncate">{studentData[ind].name}</span>
                </td>
                <td className="px-4 py-3 truncate">{student.courseTitle}</td>
                <td className="px-4  py-3">
                  {new Date(student.purchaseDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default StudentsEnrolled;
