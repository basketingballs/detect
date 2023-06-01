import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const LogOutModal = ({ open, setOpen }) => {
  const navigate = useNavigate();
  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10 h"
        onClose={() => {
          setOpen(false);
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-800 bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-50"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-50"
            >
              <Dialog.Panel className="w-1/3 max-w-6xl h-1/3 min-w-md transform rounded-lg bg-white p-8 text-left align-middle drop-shadow-2xl transition-all flex flex-col">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-12 sm:w-12">
                    <ExclamationTriangleIcon
                      className="h-8 w-8 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-slate-900 pt-2"
                    >
                      Are you sure you want to logout ?
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-md text-slate-500">
                        This means you'll have to log back in again !!!
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-grow items-center justify-center">
                  <button
                    onClick={() => {
                      setOpen(false);
                    }}
                    className="bg-indigo-700 text-white py-3 px-8 rounded-xl lg:ml-8 hover:bg-indigo-900 duration-500"
                  >
                    cancel
                  </button>
                  <button
                    onClick={logout}
                    className="bg-red-500 text-white py-3 px-8 rounded-xl lg:ml-8 hover:bg-red-700 duration-500"
                  >
                    logout
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default LogOutModal;
