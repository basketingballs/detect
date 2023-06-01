import React from "react";
import { Link } from "react-router-dom";

const Lab = () => {
  return (
    <main className="flex-1 p-2 overflow-y-auto">
      <div className="mx-3">
        <h2 className="text-3xl font-medium font-bold text-slate-700 mb-2">
          Reports
        </h2>
        <div className="text-sm font-sans text-gray-500 mb-8">
          <Link to={"/hdoc"} className="underline hover:text-indigo-700">
            Home
          </Link>
          <Link to={"/reports"} className="underline hover:text-indigo-700">
            Reports
          </Link>
          / / Anapath reports
        </div>
      </div>
      <div className="grid grid-cols-1 mb-8 mx-6 gap-3">
        <div className="w-full px-4 py-5 bg-white rounded-md shadow">
          <div className="inline text-xl font-sans text-slate-800">
            Anapath reports
          </div>
          <hr className="my-4 mx- border-slate-200" />
          <div className="mx-4 space-y-2"></div>
        </div>
      </div>
    </main>
  );
};

export default Lab;
