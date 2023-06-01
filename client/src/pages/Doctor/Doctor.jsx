import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import Nav from "./Nav/Nav";
import SideBar from "./SideBar";
import Dashboard from "./Dashboard/Dashboard";
import Chart from "./Chart/Charts";
import Help from "./Help/Help";
import Test from './Test/Test';
import History from "./History/History"

export default function Doctor(){
  const [connectedUser, setConnectedUser] = useState(
    JSON.parse(localStorage.getItem("user data"))
  );
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const navigate = useNavigate();

  /* Guard head doctor Page */
  const getConnectedUserData = async () => {
    if (connectedUser == null || connectedUser.type != "doctor") {
      return navigate("/login");
    }

    const options = {
      method: "GET",
      headers: {
        authorization: `${JSON.parse(localStorage.getItem("token"))}`,
      },
    };
    try {
      const response = await fetch(
        "http://localhost:5000/auth",
        options
      );
      const body = await response.json();

      if (body.message == "UnAuthorized") {
        localStorage.removeItem("token");
        localStorage.removeItem("user data");
        navigate("/login");
        return;
      } else if (body.message == "Bad Token") {
        localStorage.removeItem("token");
        localStorage.removeItem("user data");
        setConnectedUser({});
        navigate("/login");
        return;
      } else if (body.message == "Authorized") {
        toast.success(`Welcome ${connectedUser.name}`);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

    useEffect(() => {
        getConnectedUserData();
    }, []);

  return (
    <>
      <Toaster />
      <div className="relative h-[100vh] min-w-full">

        <Nav />
        <SideBar setComponent={setActiveComponent} />
        <main className="absolute top-16 bottom-0 right-0 left-[250px] overflow-y-scroll p-4 flex flex-col ">
        <h1 className='text-3xl font-sans text-slate-700 pb-4 capitalize'>{activeComponent}</h1>
          {activeComponent == "dashboard" && <Dashboard />}
          {activeComponent == "campaign" && <Campaign />}
          {activeComponent == "chart" && <Chart />}
          {activeComponent == "help" && <Help />}
          {activeComponent == "test" && <Test />}
          {activeComponent == "history" && <History />}
        </main>
      </div>
    </>
  );
};
