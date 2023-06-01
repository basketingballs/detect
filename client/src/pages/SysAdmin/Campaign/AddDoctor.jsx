import React from "react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import PersonService from "../../../service/PersonServices";

export default function AddDoctor({ unit, activeDocs, setOpen }) {
  const [doctors, setDoctors] = useState([]);
  const [activeDoctor, setActiveDoctor] = useState([]);

  const getDoctors = async () => {
    try {
      const options = {
        method: "GET",
        headers: {
          authorization: `${JSON.parse(localStorage.getItem("token"))}`,
        },
      };

      const response = await fetch(`http://localhost:5000/doctor/all`, options);
      const body = await response.json();
      setDoctors(body);
    } catch (err) {
      console.error(err.message);
    }
  };

  const initDoctors = async () => {
    try {
      const buffer = await JSON.parse(sessionStorage.getItem("codtorTable"));
      if (
        !buffer ||
        Math.floor((new Date() - new Date(buffer.created)) / (1000 * 60)) > 0
      ) {
        getDoctors();
      } else {
        setDoctors(buffer.body);
      }
      const active = [];
      for (let i = 0; i < activeDocs.length; i++) {
        if ((activeDocs[i].status = 1)) {
          active.push(activeDocs[i].doctor_id);
        }
      }
      setActiveDoctor(active);
    } catch (err) {
      console.error(err.message);
    }
  };

  const AddDoctor = async (id) => {
    try {
      const response = await PersonService.AddUnitDoc({
        doctor_id: id,
        camp_unit_id: unit.camp_unit_id,
      });
      toast.success(response.data.message);
      setOpen(false);
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  useEffect(() => {
    initDoctors();
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
              lastname
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
            >
              speciality
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
              Link
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {doctors.map((doctor) => (
            <tr key={doctor.doctor_id}>
              <td className="px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap">
                {doctor.doctor_id}
              </td>
              <td className="px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap">
                {doctor.first_name}
              </td>
              <td className="px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap">
                {doctor.last_name}
              </td>
              <td className="px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap">
                {doctor.speciality}
              </td>
              <td className="px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap">
                {doctor.email}
              </td>
              <td className="px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap">
                {activeDoctor.includes(doctor.doctor_id) ? (
                  <span className="text-red-500">already in a unit</span>
                ) : (
                  <button
                    onClick={() => AddDoctor(doctor.doctor_id)}
                    className="bg-green-400 text-white py-3 px-5 rounded lg:ml-8 hover:bg-green-700 duration-500"
                  >
                    link doctor
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
