import React, { useState } from "react";
import { Link } from "react-router-dom";
import femaledoctor from "../../assets/femaledoctor.jpg";

function NavBar({ active, setComponent }) {
  const [isOpen, setIsOpen] = useState(false);
  const myClass =
    "flex flex-1 text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium items-left md:items-center justify-center";
  return (
    <>
      <nav className="bg-slate-900 min-w-16 md:h-16 w-full flex items-center">
        <div className="md:flex w-full md:h-16 px-10 justify-between items-center relative">
          <Link to={"/"} className="rounded flex justify-between">
            <div className="flex gap-2 md:justify-center items-center">
              <img
                className="h-8 w-8"
                src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                alt="Workflow"
              />
              <span className="text-3xl font-semibold whitespace-nowrap text-white">
                DETECT ++
              </span>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white md:hidden my-5"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </Link>
          <div className="md:flex md:justify-between">
            <div
              className={`md:flex md:w-96 flex-col md:flex-row ${
                isOpen ? "flex" : "hidden"
              }`}
            >
              <button
                className={`${myClass} ${
                  active === "home" ? "text-white" : ""
                }`}
                onClick={() => {
                  setComponent("home");
                }}
              >
                Home
              </button>

              <button
                className={`${myClass} ${
                  active === "events" ? "text-white" : ""
                }`}
                onClick={() => {
                  setComponent("events");
                }}
              >
                Events
              </button>

              <button
                className={`${myClass} ${
                  active === "contact" ? "text-white" : ""
                }`}
                onClick={() => {
                  setComponent("contact");
                }}
              >
                Contact Us
              </button>

              <button
                className={`${myClass} ${
                  active === "ourteam" ? "text-white" : ""
                }`}
                onClick={() => {
                  setComponent("ourteam");
                }}
              >
                Our Team
              </button>
            </div>
          </div>
          <div
            className={`md:flex justify-center md:m-0 my-2 items-left ${
              isOpen ? "flex" : "hidden"
            }`}
          >
            {!JSON.parse(localStorage.getItem("user data")) ? (
              <Link
                to={"/login"}
                className="bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-400 duration-500"
              >
                Sign In
              </Link>
            ) : (
              <Link to={"/sysadmin"}>
                <img
                  className="flex rounded-full w-12"
                  src={femaledoctor}
                  alt="Example Image"
                />
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
