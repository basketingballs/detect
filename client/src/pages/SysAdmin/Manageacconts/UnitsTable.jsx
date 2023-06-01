import React from "react";
import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";

import CreateUnitForm from "./CreateUnitForm";

export default function UnitsTable() {
  const [units, SetUnits] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [delRef, setDelRef] = useState(false);

  const deleteUnit = async (id) => {
    try {
      const options = {
        method: "POST",
        headers: {
          authorization: `${JSON.parse(localStorage.getItem("token"))}`,
        },
      };

      const response = await fetch(
        `http://localhost:5000/unit/delete/${id}`,
        options
      );
      const body = await response.json();
      toast.success(body.message);
    } catch (err) {
      console.log(err.message);
    }
  };

  const getUnits = async () => {
    try {
      const options = {
        method: "GET",
        headers: {
          authorization: `${JSON.parse(localStorage.getItem("token"))}`,
        },
      };

      const response = await fetch(`http://localhost:5000/unit/all`, options);
      const body = await response.json();

      SetUnits(body);
      const buffer = {
        body: body,
        created: new Date().toISOString(),
      };
      sessionStorage.setItem("unitTable", JSON.stringify(buffer));
    } catch (err) {
      console.error(err.message);
    }
  };

  const initUnits = async () => {
    try {
      const buffer = await JSON.parse(sessionStorage.getItem("unitTable"));
      if (
        !buffer ||
        Math.floor((new Date() - new Date(buffer.created)) / (1000 * 60)) > 0
      ) {
        getUnits();
      } else {
        SetUnits(buffer.body);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const createUnit = async () => {
    setOpen(true);
  };

  const getID = (id) => {
    toast.success(id);
  };

  useEffect(() => {
    initUnits();
  }, [openDel, open]);

  return (
    <>
      <CreateUnitForm open={open} setOpen={setOpen} />

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
                      deleteUnit(delRef.unit_id);
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
      <div className="w-full flex justify-end">
        <button
          onClick={createUnit}
          className="bg-indigo-700 text-white py-3 px-5 rounded lg:ml-8 hover:bg-blue-900 duration-500"
        >
          Add Unit
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
              wilaya
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
            >
              dayra
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
            >
              baladya
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
            >
              neighbourhood
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
            >
              postal_code
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
          {units.map((unit) => (
            <tr key={unit.unit_id}>
              <td className="px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap">
                {unit.unit_id}
              </td>
              <td className="px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap">
                {unit.name}
              </td>
              <td className="px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap">
                {unit.wilaya}
              </td>
              <td className="px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap">
                {unit.dayra}
              </td>
              <td className="px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap">
                {unit.baladya}
              </td>
              <td className="px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap">
                {unit.neighbourhood}
              </td>
              <td className="px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap">
                {unit.postal_code}
              </td>
              <td className="px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap">
                Dr. {unit.admin_name}
              </td>
              <td className="px-3 py-4 text-sm text-center font-medium whitespace-nowrap">
                <button
                  className="text-green-500 hover:text-green-700"
                  onClick={() => getID(unit.unit_id)}
                >
                  Edit
                </button>
              </td>
              <td className="px-3 py-4 text-sm font-medium text-right whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => {
                    setOpenDel(true);
                    setDelRef(unit);
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
