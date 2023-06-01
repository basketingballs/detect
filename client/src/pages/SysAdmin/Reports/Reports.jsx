import React from "react";
import { Link } from "react-router-dom";

const Lab = () => {
  return (
    <>
      <div className="grid grid-cols-3 mb-8 mx-6 gap-4">
        <Link
          to={"/unitrep"}
          className="w-full px-4 py-5 bg-white rounded-md shadow-xl hover:bg-indigo-400/30"
        >
          <div className="inline text-xl font-sans text-slate-800">
            Units reports
          </div>
          <hr className="my-4 mx- border-slate-200" />
          <div className="mx-4 space-y-2"></div>
        </Link>
        <Link
          to={"/labrep"}
          className="w-full px-4 py-5 bg-white rounded-md shadow-xl hover:bg-indigo-300/30"
        >
          <div className="inline text-xl font-sans text-slate-800">
            Laboratories reports
          </div>
          <hr className="my-4 mx- border-slate-200" />
          <div className="mx-4 space-y-2"></div>
        </Link>
        <Link
          to={"/anapathrep"}
          className="w-full px-4 py-5 bg-white rounded-md shadow-xl hover:bg-indigo-400/30"
        >
          <div className="inline text-xl font-sans text-slate-800">
            Anapath reports
          </div>
          <hr className="my-4 mx- border-slate-200" />
          <div className="mx-4 space-y-2"></div>
        </Link>
      </div>
    </>
  );
};

export default Lab;
