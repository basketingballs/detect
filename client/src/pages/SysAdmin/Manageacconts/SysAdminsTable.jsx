import React from "react";
import { Fragment, useState, useEffect } from "react";
import { Menu, Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";

import CreateAdminForm from "./CreateAdminForm";

export default function SysadminsTable() {
  const [sysadmins, setSysadmins] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [delRef, setDelRef] = useState(false);

  const deleteSysadmin = async (id) => {
    try {
      const options = {
        method: "POST",
        headers: {
          authorization: `${JSON.parse(localStorage.getItem("token"))}`,
        },
      };

      const response = await fetch(
        `http://localhost:5000/sysadmin/delete/${id}`,
        options
      );
      const body = await response.json();
      toast.success(body.message);
    } catch (err) {
      console.log(err.message);
    }
  };

  const getSysadmins = async () => {
    try {
      const options = {
        method: "GET",
        headers: {
          authorization: `${JSON.parse(localStorage.getItem("token"))}`,
        },
      };

      const response = await fetch(
        `http://localhost:5000/sysadmin/all`,
        options
      );
      const body = await response.json();

      setSysadmins(body);
      const buffer = {
        body: body,
        created: new Date().toISOString(),
      };
      sessionStorage.setItem("sysadminTable", JSON.stringify(buffer));
    } catch (err) {
      console.error(err.message);
    }
  };

  const initSysadmins = async () => {
    try {
      const buffer = await JSON.parse(sessionStorage.getItem("sysadminTable"));
      if (
        !buffer ||
        Math.floor((new Date() - new Date(buffer.created)) / (1000 * 60)) > 0
      ) {
        getSysadmins();
      } else {
        setSysadmins(buffer.body);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const createSysadmin = async () => {
    setOpen(true);
  };

  const getID = (id) => {
    toast.success(id);
  };

  const sortById = () => {
    let sortedArray;
    if (sysadmins[0].admin_id < sysadmins[1].admin_id)
      sortedArray = [...asysdmins].sort((a, b) => b.admin_id - a.admin_id);
    else sortedArray = [...sysadmins].sort((a, b) => a.admin_id - b.admin_id);
    setSysadmins(sortedArray);
  };

  const sortByStatus = () => {
    const sortedArray = [...sysadmins].sort((a, b) => b.status - a.status);
    setSysadmins(sortedArray);
  };

  useEffect(() => {
    initSysadmins();
  }, []);

  return (
    <>
      <CreateAdminForm open={open} setOpen={setOpen} />

      <Transition show={openDel} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 h"
          onClose={() => {
            setOpenDel(false);
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
            <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                <Dialog.Panel className="transform overflow-y-scroll rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all flex flex-col items-center">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Do you really want to delete Dr. {delRef.last_name} ?
                  </Dialog.Title>
                  <Dialog.Description
                    as="h5"
                    className="text-sm font-small leading-6 text-gray-700"
                  >
                    proceed with caution
                  </Dialog.Description>
                  <button
                    onClick={() => {
                      deleteSysadmin(delRef.admin_id);
                      getSysadmins();
                      setOpenDel(false);
                    }}
                    className="bg-red-500 text-white py-3 px-5 rounded lg:ml-8 hover:bg-red-700 duration-500 m-5"
                  >
                    Delete
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <div className="w-full flex justify-between">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="bg-white text-indigo-600 py-3 px-5 rounded-2xl lg:ml-8 ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 ring-2 duration-500">
              Sort
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      className={`${
                        active ? "bg-violet-500 text-white" : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      onClick={() => sortById()}
                    >
                      by id
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      className={`${
                        active ? "bg-violet-500 text-white" : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      onClick={sortByStatus}
                    >
                      by status
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
        <button
          onClick={createSysadmin}
          className="bg-indigo-700 text-white py-3 px-5 rounded lg:ml-8 hover:bg-blue-900 duration-500"
        >
          Add System Admin
        </button>
      </div>
      <table className=" w-full divide-y divide-gray-200 m-5 border rounded-lg">
        <thead className="bg-indigo-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
            >
              Id
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
            >
              name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
            >
              lastname
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
            >
              level
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
            >
              email
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
            >
              created by
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
            >
              Edit
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
            >
              Delete
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sysadmins.map((sysadmin) => (
            <tr key={sysadmin.admin_id}>
              <td className="px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap">
                {sysadmin.admin_id}
              </td>
              <td className="px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap">
                {sysadmin.first_name}
              </td>
              <td className="px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap">
                {sysadmin.last_name}
              </td>
              <td className="px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap">
                {sysadmin.level}
              </td>
              <td className="px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap">
                {sysadmin.email}
              </td>
              <td className="px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap">
                Dr. {sysadmin.admin_name}
              </td>
              <td className="px-3 py-4 text-sm text-center font-medium whitespace-nowrap">
                <button
                  className="text-green-500 hover:text-green-700"
                  onClick={() => getID(sysadmin.admin_id)}
                >
                  Edit
                </button>
              </td>
              <td className="px-3 py-4 text-sm font-medium text-right whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => {
                    setOpenDel(true);
                    setDelRef(sysadmin);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
