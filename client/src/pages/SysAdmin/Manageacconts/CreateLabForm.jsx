import React, { Fragment, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";

import PersonService from "../../../service/PersonServices";

const CreateLabForm = ({ open, setOpen }) => {
  const [name, setName] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [dayra, setDayra] = useState("");
  const [baladya, setBaladya] = useState("");
  const [neighbourhood, setNeighbourhood] = useState("");
  const [postal_code, setPostal_code] = useState(0);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    wilaya: "",
    dayra: "",
    baladya: "",
    neighbourhood: "",
    postal_code: "",
    email: "",
    phone: "",
  });

  const handleValueChange = (newValue) => {
    setValue(newValue);
  };

  const formValidation = () => {
    let status = true;
    let localErrors = {
      name: "",
      wilaya: "",
      dayra: "",
      baladya: "",
      neighbourhood: "",
      postal_code: "",
      email: "",
      phone: "",
    };

    if (!name.trim()) {
      localErrors.name = "Name is required.";
      status = false;
    }

    if (!wilaya.trim()) {
      localErrors.wilaya = "wilaya is required.";
      status = false;
    }
    if (!dayra.trim()) {
      localErrors.dayra = "dayra is required.";
      status = false;
    }
    if (!baladya.trim()) {
      localErrors.baladya = "baladya is required.";
      status = false;
    }
    if (!neighbourhood.trim()) {
      localErrors.neighbourhood = "neighbourhood is required.";
      status = false;
    }
    if (postal_code == 0 || isNaN(postal_code)) {
      localErrors.postal_code = "postal_code is required.";
      status = false;
    }

    if (!email.trim()) {
      localErrors.email = "Email is required.";
      status = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      localErrors.email = "Invalid email address.";
      status = false;
    }

    if (!phone.trim()) {
      localErrors.phone = "Phone number is required.";
      status = false;
    } else if (!/\+213[5-7][0-9]{8}$/.test(phone)) {
      localErrors.phone = "Invalid phone number.";
      status = false;
    }

    setErrors(localErrors);
    return status;
  };

  const signup = async (e) => {
    e.preventDefault();

    if (formValidation()) {
      //form valide
      const data = {
        name: name,
        wilaya: wilaya,
        dayra: dayra,
        baladya: baladya,
        neighbourhood: neighbourhood,
        postal_code: postal_code,
        email: email,
        phone: phone,
      };
      try {
        const response = await PersonService.createLab(data);
        toast.success(response.data.message);

        return false;
      } catch (err) {
        toast.error(err.response.data.message);
      }
    } else {
      //else form non valide
      toast.error("form invalid");
    }
  };

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
              <Dialog.Panel className="transform overflow-y-scroll rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-md font-sans leading-6 text-slate-500"
                >
                  Add a New Lab
                </Dialog.Title>

                <div className="w-full px-5 py-3 bg-white">
                  <h1 className="text-4xl font-semibold text-center text-blue-700 pb-4">
                    Add Lab
                  </h1>
                  <form>
                    <div className="grid grid-cols-2 mb-6 mx-4 gap-12 py-8 ">
                      <div className="relative h-11 w-full min-w-[200px]">
                        <input
                          type="text"
                          className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-indigo-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                          placeholder=" "
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                        <label className="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-indigo-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-900 peer-focus:after:scale-x-100 peer-focus:after:border-indigo-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                          Name
                        </label>
                        {errors.name != " " ? (
                          <div
                            style={{ textAlign: "left", color: "orangered" }}
                          >
                            {errors.name}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="relative h-11 w-full min-w-[200px]">
                        <input
                          type="text"
                          className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-indigo-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                          placeholder=" "
                          value={wilaya}
                          onChange={(e) => setWilaya(e.target.value)}
                        />
                        <label className="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-indigo-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-900 peer-focus:after:scale-x-100 peer-focus:after:border-indigo-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                          Wilaya
                        </label>
                        {errors.wilaya != " " ? (
                          <div
                            style={{ textAlign: "left", color: "orangered" }}
                          >
                            {errors.wilaya}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="relative h-11 w-full min-w-[200px]">
                        <input
                          type="text"
                          className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-indigo-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                          placeholder=" "
                          value={dayra}
                          onChange={(e) => setDayra(e.target.value)}
                        />
                        <label className="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-indigo-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-900 peer-focus:after:scale-x-100 peer-focus:after:border-indigo-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                          Dayra
                        </label>
                        {errors.dayra != " " ? (
                          <div
                            style={{ textAlign: "left", color: "orangered" }}
                          >
                            {errors.dayra}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="relative h-11 w-full min-w-[200px]">
                        <input
                          type="text"
                          className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-indigo-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                          placeholder=" "
                          value={baladya}
                          onChange={(e) => setBaladya(e.target.value)}
                        />
                        <label className="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-indigo-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-900 peer-focus:after:scale-x-100 peer-focus:after:border-indigo-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                          Baladya
                        </label>
                        {errors.baladya != " " ? (
                          <div
                            style={{ textAlign: "left", color: "orangered" }}
                          >
                            {errors.baladya}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="relative h-11 w-full min-w-[200px]">
                        <input
                          type="text"
                          className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-indigo-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                          placeholder=" "
                          value={neighbourhood}
                          onChange={(e) => setNeighbourhood(e.target.value)}
                        />
                        <label className="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-indigo-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-900 peer-focus:after:scale-x-100 peer-focus:after:border-indigo-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                          Neighbourhood
                        </label>
                        {errors.neighbourhood != " " ? (
                          <div
                            style={{ textAlign: "left", color: "orangered" }}
                          >
                            {errors.neighbourhood}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="relative h-11 w-full min-w-[200px]">
                        <input
                          type="text"
                          className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-indigo-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                          placeholder=" "
                          value={postal_code}
                          onChange={(e) => setPostal_code(e.target.value)}
                        />
                        <label className="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-indigo-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-900 peer-focus:after:scale-x-100 peer-focus:after:border-indigo-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                          Neighbourhood
                        </label>
                        {errors.postal_code != " " ? (
                          <div
                            style={{ textAlign: "left", color: "orangered" }}
                          >
                            {errors.postal_code}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="relative h-11 w-full min-w-[200px]">
                        <input
                          type="email"
                          className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-indigo-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                          placeholder=" "
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <label className="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-indigo-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-900 peer-focus:after:scale-x-100 peer-focus:after:border-indigo-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                          Email
                        </label>
                        {errors.email != " " ? (
                          <div
                            style={{ textAlign: "left", color: "orangered" }}
                          >
                            {errors.email}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="relative h-11 w-full min-w-[200px]">
                        <input
                          className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-indigo-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                          placeholder=" "
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                        <label className="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-indigo-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-900 peer-focus:after:scale-x-100 peer-focus:after:border-indigo-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                          Phone
                        </label>
                        {errors.phone != " " ? (
                          <div
                            style={{ textAlign: "left", color: "orangered" }}
                          >
                            {errors.phone}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end items-end">
                      <button
                        type="button"
                        onClick={signup}
                        className="bg-indigo-700 text-white py-3 px-16 rounded-lg lg:ml-8 hover:bg-blue-900 duration-500"
                      >
                        Create
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateLabForm;
