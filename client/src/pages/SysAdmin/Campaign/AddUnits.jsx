import React from "react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import PersonService from "../../../service/PersonServices";

export default function AddUnits({ unitList, setOpen }) {
  const [units, SetUnits] = useState([]);
  const [activeUnits, SetActiveUnits] = useState([]);

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
      const activeUnit = [];
      for (let i = 0; i < unitList.length; i++) {
        if ((unitList[i].status = 1)) {
          activeUnit.push(unitList[i].unit_id);
        }
      }
      SetActiveUnits(activeUnit);
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

  const addUnit = async (id) => {
    try {
      console.log(id);
      const buffer = await JSON.parse(sessionStorage.getItem("campaign"));
      const response = await PersonService.AddUnitCampaign({
        unit_id: id,
        campaign_id: buffer.body.campaign_id,
      });
      toast.success(response.data.message);
      setOpen(false);
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const removeUnit = async (id) => {
    try {
      const buffer = await JSON.parse(sessionStorage.getItem("campaign"));
      const response = await PersonService.removeUnitCampaign({
        unit_id: id,
        campaign_id: buffer.body.campaign_id,
      });
      toast.success(response.data.message);
      setOpen(false);
    } catch (err) {
      toast.error(err.data.message);
    }
  };

  useEffect(() => {
    initUnits();
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
              scope="col
                        "
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
              add
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase "
            >
              Remove
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
              <td className="px-3 py-4 text-sm font-medium text-center whitespace-nowrap">
                {!activeUnits.includes(unit.unit_id) ? (
                  <button
                    onClick={() => addUnit(unit.unit_id)}
                    className="bg-indigo-700 text-white py-3 px-5 rounded lg:ml-8 hover:bg-blue-900 duration-500"
                  >
                    Add Unit
                  </button>
                ) : (
                  <span>not added</span>
                )}
              </td>
              <td className="px-3 py-4 text-sm font-medium text-center whitespace-nowrap">
                {activeUnits.includes(unit.unit_id) ? (
                  <button
                    onClick={() => removeUnit(unit.unit_id)}
                    className="bg-red-700 text-white py-3 px-5 rounded lg:ml-8 hover:bg-red-900 duration-500"
                  >
                    remove Unit
                  </button>
                ) : (
                  <span>not added</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
