import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { assets, dummyDashboardData } from "../../assets/assets";
import Loading from "../../components/student/Loading";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { currency, backendUrl, getToken, isEducator } = useContext(AppContext);
  const [dashboard, setDashboard] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/educator/dashboard", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      console.log(data);
      if (data.success) {
        setDashboard(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchDashboardData();
    }
  }, [dashboard, isEducator]);

  return dashboard ? (
    <div className="min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="space-y-5">
        <div className="flex flex-wrap gap-5 items-center">
          <div className="flex item-center gap-3 shadow-md border border-blue-500 p-4 w-[14.5rem] rounded-md">
            <img src={assets.patients_icon} alt="patient_icon" />{" "}
            <div className="w-full">
              <p className="text-2xl font-medium text-gray-600 ">
                {dashboard.enrolledStudentsData.length}
              </p>{" "}
              <p className="text-base text-gray-500">Total Enrollments</p>
            </div>
          </div>
          <div className="flex item-center gap-3 shadow-md border border-blue-500 p-4 w-[14.5rem] rounded-md">
            <img src={assets.appointments_icon} alt="appointments_icon" />{" "}
            <div className="w-full">
              <p className="text-2xl font-medium text-gray-600 ">
                {dashboard.totalCourses}
              </p>{" "}
              <p className="text-base text-gray-500">Total Courses</p>
            </div>
          </div>
          <div className="flex item-center gap-3 shadow-md border border-blue-500 p-4 w-[14.5rem] rounded-md">
            <img src={assets.earning_icon} alt="earning_icon" />{" "}
            <div className="w-full">
              <p className="text-2xl font-medium text-gray-600 ">
                {currency} {dashboard.totalEarnings}
              </p>{" "}
              <p className="text-base text-gray-500">Total Earnings</p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="pb-4 text-lg font-medium">Latest Enrollments</h2>
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className="table-fixed md:table-auto w-full overflow-hidden">
              <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
                <tr>
                  <th className=" text-center hidden sm:table-cell">#</th>
                  <th className="px-4 py-3 font-semibold">Student Name</th>
                  <th className="px-4 py-3 font-semibold">Course Title</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {dashboard.enrolledStudentsData.map((item, ind) => (
                  <tr key={ind} className="border-b border-gray-500/20">
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      {ind + 1}
                    </td>
                    <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                      <img
                        src={item.student.imageUrl}
                        alt="Profile"
                        className="w-9 h-9 rounded-full"
                      />
                      <span className="truncate">{item.student.name}</span>
                    </td>
                    <td className="px-4 py-3 truncate">{item.courseTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Dashboard;
