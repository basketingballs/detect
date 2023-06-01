import React from "react";
import { Link } from "react-router-dom";

//TODO: Clean Up this Code...

export default function ForgotPassword({ nav }) {
  return (
    <div className="w-full p-6 bg-slate-200 rounded-md shadow-xl lg:max-w-2xl flex flex-col items-center gap-10">
      <h1 className="text-4xl font-semibold text-left text-blue-700 pb-4">
        Forgot password
      </h1>
      <Link
        to={"/"}
        className="text-blue-600 hover:text-blue-600 transition duration-500"
      >
        <svg
          className=" w-6 h-6 inline-block align-bottom "
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
        Back to Home
        <i className="fas fa-chevron-circle-left fa-fw"></i>
      </Link>
      <form className="w-full">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-800"
          >
            Email
          </label>
          <input
            placeholder="Enter your email"
            type="email"
            className="border-blue-200 block w-full px-4 py-2 text-gray-800 bg-slate-50 border rounded-md focus:border-blue-600 focus:ring-blue-200 focus:outline-none focus:ring focus:ring-opacity-40"
          />
        </div>
      </form>

      <button className=" w-1/3 text-center transition duration-500 bg-indigo-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline">
        Send
      </button>
      <button onClick={nav} className="text-xs text-blue-600 hover:underline">
        just remembered it!!
      </button>
    </div>
  );
}
