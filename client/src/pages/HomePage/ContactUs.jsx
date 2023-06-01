import React from "react";
import Contact_us from "../../assets/contact_us.webp";

export default function ContactUs() {
  const myClass = "w-full px-20 py- bg-white rounded-md drop-shadow-2xl";

  return (
    <div className="d-flex container-fluid flex-col">
      <main className="p-4 overflow-y-auto">
        <div className="mx-8 my-16">
          <div className={myClass}>
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="w-full md:w-1/2 md:text-center md:px-4">
                <div className="absolute -top-20 text-9xl font-semibold text-indigo-800 drop-shadow-2xl">
                  Help <span>Center</span>
                </div>
                <div className="text-justify text-slate-700 font-sans text-2xl mb-4">
                  How can we help you ?
                </div>
                <div className="flex items-center">
                  <form className="my-6 flex">
                    <input
                      type="text"
                      className="block w-full px-44 pl-2 text-sm rounded-lg bg-slate-50 border-gray-300 focus:border-transparent focus:ring-gray-500"
                      placeholder="search here ..."
                    />
                    <button className="ml-2 px-10 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-800 shadow-xl text-white">
                      Search
                    </button>
                  </form>
                </div>
              </div>
              <div className="w-full md:w-1/2 md:text-center md:px-4">
                <img src={Contact_us} alt="Logo" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
