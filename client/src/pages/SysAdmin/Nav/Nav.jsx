import React, { Fragment, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import Notification from "./PanelNav/Notification";
import Profile from './PanelNav/Profile'

function Navbar() {
  const [open, setOpen] = useState(false);
  const panelButtonRef = useRef(null);

  const [show, setShow] = useState(false);
  const panelBtnRef = useRef(null);

  const [activeComponent, setActiveComponent] = useState("profile");

  const handleComponentClick = (componentName) => {
    setActiveComponent(componentName);
  };

  const [buttonClicked, setButtonClicked] = useState(false);
  const handleButtonClick = () => {
    setShowNotification(true);
    setButtonClicked(true);
  };

  return (
    <nav className="absolute top-0 right-0 left-0 min-w-md h-16 flex justify-between items-center p-2 px-10 bg-slate-900 text-white">
      <Link to={"/"} className="flex items-center">
        <img
          className="h-6 w-6"
          src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
          alt="Workflow"
        />
        <span className="text-xl font-semibold pl-4 dark:text-white">
          DETECT ++
        </span>
      </Link>
      <div className="flex items-center justify-evenly">
        <button type="button" onClick={() => setOpen(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-gray-100"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                  <Transition.Child
                    as={Fragment}
                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                    leaveFrom="translate-x-0"
                    leaveTo="translate-x-full"
                  >
                    <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-500"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                          <button
                            type="button"
                            className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                            onClick={() => setOpen(false)}
                          >
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </Transition.Child>
                      <div className="flex h-full flex-col overflow-y-scroll bg-slate-50 py-6 shadow-xl">
                        <div className="px-4 sm:px-6">
                          <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                            <div
                              div
                              className="fixed top-0 left-0 bottom-0 w-full z-10 overflow-y-scroll"
                            >
                              <ul className="flex pt-6 justify-evenly text-slate-800 text-md text-sans">
                                <li
                                  onClick={() =>
                                    handleComponentClick("profile")
                                  }
                                  className={`cursor-pointer hover:text-indigo-600 ${
                                    activeComponent === "profile"
                                      ? "text-indigo-700 shadow-lg underline underline-offset-8 underline decoration-2"
                                      : "bg-slate-50"
                                  }`}
                                >
                                  Profile
                                </li>

                                <li
                                  onClick={() =>
                                    handleComponentClick("notification")
                                  }
                                  className={`cursor-pointer hover:text-indigo-600 ${
                                    activeComponent === "notification"
                                      ? "text-indigo-700 shadow-lg underline underline-offset-8 underline decoration-2"
                                      : "bg-slate-50"
                                  }`}
                                >
                                  Notification
                                </li>
                              </ul>
                              {activeComponent === "profile" && <Profile />}
                              {activeComponent === "notification" && (
                                <Notification />
                              )}
                            </div>
                          </Dialog.Title>
                        </div>
                        <div className="relative mt-6 flex-1 px-4 sm:px-6"></div>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </nav>
  );
}

export default Navbar;
