import React from "react";

const Help = () => {
  return (
    <div className="w-full px-4 py-5 bg-white rounded-md shadow-xl">
      <form className="my-6 flex justify-center">
        <input
          type="email"
          className="w-96 p-2 pl-10 text-sm rounded-lg bg-slate-50 border "
          placeholder="Enter your email"
        />
        <div className="ml-2 px-12 py-2 rounded-lg bg-teal-600 text-white hover:bg-white hover:text-teal-800 hover:border-solid border-2 border-teal-600 duration-700">
          Send
        </div>
      </form>
    </div>
  );
};

export default Help;
