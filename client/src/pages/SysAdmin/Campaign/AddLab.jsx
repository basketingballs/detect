import React from "react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import PersonService from "../../../service/PersonServices";

export default function AddLab({ unit, setOpen }) {
  const [labs, setLabs] = useState([]);

  const getLabs = async () => {
    try {
      const options = {
        method: "GET",
        headers: {
          authorization: `${JSON.parse(localStorage.getItem("token"))}`,
        },
      };

      const response = await fetch(`http://localhost:5000/lab/all`, options);
      const body = await response.json();
      setLabs(body);
    } catch (err) {
      console.error(err.message);
    }
  };

  const initLabs = async () => {
    try {
      const buffer = await JSON.parse(sessionStorage.getItem("labTable"));
      if (
        !buffer ||
        Math.floor((new Date() - new Date(buffer.created)) / (1000 * 60)) > 0
      ) {
        getLabs();
      } else {
        setLabs(buffer.body);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const addLab = async (id) => {
    try {
      const response = await PersonService.AddUnitLab({
        lab_id: id,
        camp_unit_id: unit.camp_unit_id,
      });
      toast.success(response.data.message);
      setOpen(false);
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  useEffect(() => {
    initLabs();
  }, []);

  return (
    <>
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
              adress
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
              add
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {labs.map((lab) => (
            <tr key={lab.lab_id}>
              <td className="px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap">
                {lab.lab_id}
              </td>
              <td className="px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap">
                {lab.name}
              </td>
              <td className="px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap">
                {lab.wilaya},{lab.baladya}
              </td>

              <td className="px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap">
                {lab.email}
              </td>
              <td className="px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap">
                <button
                  onClick={() => addLab(lab.lab_id)}
                  className="bg-indigo-700 text-white py-3 px-5 rounded lg:ml-8 hover:bg-blue-900 duration-500"
                >
                  link lab
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
