import { useState } from "react";

import LogOutModal from "../LogOutModal";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`${
        id === open ? "rotate-180" : ""
      } h-6 w-6 p-1 transition-transform`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function SideBar({ setComponent }) {
  const [activeComponent, setActiveComponent] = useState("dashboard");

  const handleComponentClick = (componentName) => {
    setActiveComponent(componentName);
  };

  const [logout, setLogout] = useState(false);
  const [open, setOpen] = useState(0);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };
  return (
    <nav className="absolute left-0 top-16 bottom-0 w-[250px] flex overflow-y-auto px-6 py-4 bg-white shadow">
      <LogOutModal open={logout} setOpen={setLogout} />
      <div className="flex-1">
        <ul className="pt-2 pb-4 space-y-4 text-sm text-gray-700">
          <li className="hover:bg-gray-700 hover:text-gray-100 px-2 rounded-md">
            <button
              onClick={() => {
                setComponent("dashboard");
              }}
              className="flex items-center p-2 w-full space-x-3 font-semibold rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>Dashboard</span>
            </button>
          </li>
          <li className="hover:bg-gray-700 hover:text-gray-100 px-2 rounded-md">
            <button
              onClick={() => {
                setComponent("chart");
              }}
              className="flex items-center p-2 w-full space-x-3 font-semibold rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
                />
              </svg>

              <span>Chart</span>
            </button>
          </li>
          <li className="hover:bg-gray-700 hover:text-gray-100 px-2 rounded-md">
            <button
              onClick={() => {
                setComponent("test");
              }}
              className="flex items-center p-2 w-full space-x-3 font-semibold rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                />
              </svg>

              <span>Add New Tests</span>
            </button>
          </li>
          <li className="hover:bg-gray-700 hover:text-gray-100 px-2 rounded-md">
            <button
              onClick={() => {
                setComponent("history");
              }}
              className="flex items-center p-2 w-full space-x-3 font-semibold rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                />
              </svg>

              <span>History</span>
            </button>
          </li>
          <li className="hover:bg-gray-700 hover:text-gray-100 px-2 rounded-md">
            <button
              onClick={() => {
                setComponent("help");
              }}
              className="flex items-center p-2 w-full space-x-3 font-semibold rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>

              <span>Help</span>
            </button>
          </li>
          <hr />
          <li className="hover:bg-gray-700 hover:text-gray-100 px-2 rounded-md">
            <button
              onClick={() => {
                setLogout(true);
              }}
              className="flex items-center p-2 w-full space-x-3 font-semibold rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
