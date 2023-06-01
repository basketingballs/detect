import React, { useState } from "react";
import Chart from "./DashboardChart";
import LineChart from "./Sparkline";
import Line from "./Sparkbar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Dashboard = () => {

  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <>
      <div className="grid grid-rows-7 grid-flow-col gap-2">
        <div className="row-span-4 col-span-4 w-full px-4 py-5 bg-white rounded-md shadow">
          <div className="inline text-xl font-sans text-center text-slate-800">
            Today's cases
          </div>
          <div className="inline text-xl font-medium pl-48 text-indigo-600">
            {" "}
            125,490
          </div>
          <div className="text-sm font-sans text-left pt-2 text-gray-400 truncate">
            January - July 2022
          </div>
        </div>
        <div className="col-span-2 row-span-2 w-full px-10 py-5 bg-gradient-to-r from-indigo-400 via-indigo-600 to-indigo-700 rounded-md shadow">
          <div className="text-3xl font-sans font-bold text-left text-slate-200 truncate">
            {" "}
            240
          </div>
          <div className="text-lg font-medium text-left text-gray-100 truncate">
            This week cases
          </div>
          <LineChart />
        </div>
        <div className="col-span-2 row-span-2 w-full px-10 py-5 bg-gradient-to-r from-red-400 via-red-600 to-red-700 rounded-md shadow">
          <div className="text-3xl font-sans font-bold text-left text-slate-200 truncate">
            {" "}
            240
          </div>
          <div className="text-lg font-medium text-left text-gray-100 truncate">
            This week cases
          </div>
          <LineChart />
        </div>
        <div className="row-span-6 w-full px-4 py-5 bg-white rounded-md shadow">
          <div className="text-3xl font-sans font-bold text-center text-slate-700 truncate">
            {" "}
            1,400
          </div>
          <div className="text-lg font-medium text-center text-gray-400 truncate">
            This month cases
          </div>
          <Chart />
        </div>
      </div>
      <div className="grid grid-cols mt-3 gap-2">
        <div className="col-span-2 w-full px-4 py-5 bg-white rounded-md shadow">
          <div className="inline text-xl font-sans text-center text-slate-800">
            Hospital survey
          </div>
          <Line />
        </div>
      </div>
      <div className="grid grid-rows-3 grid-flow-col mt-3 gap-3">
        <div className="row-span-4 w-full px-4 py-5 bg-white rounded-md shadow">
          <div className="text-xl font-sans text-left pb-4 text-slate-700 truncate">
            Calendar
          </div>
          <Calendar
            onChange={(date) => setSelectedDate(date)}
            value={selectedDate}
            className="font-sans text-slate-900 bg-slate-600/50 border-2 border-slate-500/30 rounded-md shadow-md p-2"
            calendarClassName="bg-white p-2"
            tileClassName=""
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
