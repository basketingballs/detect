import React from "react";
import error from "./assets/error.webp";

const NotFound = () => {
  return (
    <div className=" container-fluid p-4 mx-8 my-12">
      <div className="w-full px-20 py- bg-white rounded-md drop-shadow-2xl">
        <div className="flex items-stretch">
          <div className="self-center w-full md:w-1/2 md:text-center md:px-4">
            <div className="text-8xl mb-12 font-bold text-indigo-800">404</div>
            <div className="mb-6">Not Found</div>
            <button className="border-2 p-3 rounded-full">Go Home</button>
          </div>
          <div className=" w-full md:w-1/2 md:text-center md:px-4">
            <img src={error} alt="Logo" className="w-auto h-96" />
          </div>
        </div>
      </div>
    </div>
    // <div className='grid grid-row-6 grid-'>
    //     <div className='col-span-3 font-bold text-5xl text-indigo-600'>Not Found</div>
    //     <div className='border-2 px-10 py-1 bg-indigo-700 rounded-full'></div>
    //     <button className='border-2 p-3 rounded-full'>Go Home</button>
    //     <img src={error} alt="hahahahahah" className='' />
    // </div>
  );
};

export default NotFound;
