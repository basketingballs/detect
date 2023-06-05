import React, { useState } from "react";
import toast from "react-hot-toast";
import service from "../../service/PersonServices";

const MIN_PASSWORD_LENGTH = 8;

const CreateAdminForm = ({ control }) => {
  const [id, setID] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [gender, setGender] = useState();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState(""); //
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [code, setCode] = useState("");

  // checks if auth code is sent or not
  const [sent, setSent] = useState(false);

  const [errors, setErrors] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    gender: "",
    date: "",
    lastname: "",
    phone: "",
    code: "",
  });

  const formValidation = () => {
    let status = true;
    let localErrors = {
      id: "",
      name: "",
      email: "",
      password: "",
      gender: "",
      lastname: "",
      date: "",
      phone: "",
    };

    if (isNaN(id)) {
      localErrors.id = "id must be a valid number";
      status = false;
    } else if (id.length !== 6) {
      localErrors.id = "id must be a 6 chars long";
      status = false;
    }

    if (!name.trim()) {
      localErrors.name = "Name is required.";
      status = false;
    }

    if (!lastname.trim()) {
      localErrors.lastname = "Lastname is required.";
      status = false;
    }

    if (gender == null) {
      localErrors.gender = "gender is required";
      status = false;
    }
    if (date == null) {
      localErrors.date = "a birthdate is required";
      status = false;
    }

    if (!email.trim()) {
      localErrors.email = "Email is required.";
      status = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      localErrors.email = "Invalid email address.";
      status = false;
    }

    if (!pw.trim()) {
      localErrors.password = "Password is required.";
      status = false;
    } else if (pw.length < MIN_PASSWORD_LENGTH) {
      localErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
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
        id: id,
        name: name,
        lastname: lastname,
        email: email,
        pw: pw,
        gender: gender,
        phone: phone,
        date: date,
        code: code,
      };
      if (sent) {
        try {
          const response = await service.signup(data);
          toast.success(response.data.message);
          setPw("");
          control();
          return false;
        } catch (err) {
          toast.error(err.response.data.message);
          if (err.response.data.failed) {
            setSent(false);
          }
        }
      } else {
        try {
          const response = await service.confirm(data);
          toast.success(response.data.message);
          setSent(true);
          return false;
        } catch (err) {
          toast.error(err.response.data.message);
        }
      }
    } else {
      
      toast.error("form invalid");
    }
  };

  return (
    <div className="w-full px-5 py-3 bg-white">
      <h1 className="text-4xl font-semibold text-center text-blue-700 pb-4">
        Create Account
      </h1>
      <form onSubmit={signup}>
        <div className="grid grid-cols-2 mb-6 mx-4 gap-12 py-8">
          <div className="relative h-11 w-full min-w-[200px]">
            <input
              type="text"
              className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-indigo-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
              placeholder=" "
              value={id}
              onChange={(e) => setID(e.target.value)}
            />
            <label className="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-indigo-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-900 peer-focus:after:scale-x-100 peer-focus:after:border-indigo-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              ID Card Number
            </label>
            {errors.id != " " ? (
              <div style={{ textAlign: "left", color: "orangered" }}>
                {errors.id}
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
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label className="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-indigo-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-900 peer-focus:after:scale-x-100 peer-focus:after:border-indigo-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              Name
            </label>
            {errors.name != " " ? (
              <div style={{ textAlign: "left", color: "orangered" }}>
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
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
            <label className="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-indigo-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-900 peer-focus:after:scale-x-100 peer-focus:after:border-indigo-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              Lastname
            </label>
            {errors.lastname != " " ? (
              <div style={{ textAlign: "left", color: "orangered" }}>
                {errors.lastname}
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="relative h-11 w-full min-w-[200px]">
            <input
              className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-indigo-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <label
              htmlFor="floatingInput"
              className="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-indigo-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-900 peer-focus:after:scale-x-100 peer-focus:after:border-indigo-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
            >
              Birth date
            </label>
            {errors.date != " " ? (
              <div style={{ textAlign: "left", color: "orangered" }}>
                {errors.date}
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
              <div style={{ textAlign: "left", color: "orangered" }}>
                {errors.phone}
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
              <div style={{ textAlign: "left", color: "orangered" }}>
                {errors.email}
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="relative h-11 w-full min-w-[200px]">
            <input
              type="password"
              className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-indigo-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
              placeholder=" "
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
            <label className="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-indigo-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-900 peer-focus:after:scale-x-100 peer-focus:after:border-indigo-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              Password
            </label>
            {errors.password != " " ? (
              <div style={{ textAlign: "left", color: "orangered" }}>
                {errors.password}
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="flex gap-10">
            <div className="inline-flex items-center">
              <label
                className="relative flex cursor-pointer items-center rounded-full p-3"
                htmlFor="html"
                data-ripple-dark="true"
              >
                <input
                  id="html"
                  name="type"
                  type="radio"
                  onClick={() => setGender(false)}
                  className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-pink-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-pink-500 checked:before:bg-pink-500 hover:before:opacity-10"
                />
                <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-pink-500 opacity-0 transition-opacity peer-checked:opacity-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                  </svg>
                </div>
              </label>
              <label
                className="mt-px cursor-pointer select-none font-sans text-gray-700"
                htmlFor="html"
              >
                Female
              </label>
            </div>
            <div className="inline-flex items-center">
              <label
                className="relative flex cursor-pointer items-center rounded-full p-3"
                htmlFor="react"
                data-ripple-dark="true"
              >
                <input
                  id="react"
                  name="type"
                  type="radio"
                  onClick={() => setGender(true)}
                  className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-blue-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                />
                <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-blue-500 opacity-0 transition-opacity peer-checked:opacity-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                  </svg>
                </div>
              </label>
              <label
                className="mt-px cursor-pointer select-none font-sans text-gray-700"
                htmlFor="react"
              >
                Male
              </label>
            </div>
            {errors.gender != " " ? (
              <div style={{ textAlign: "left", color: "orangered" }}>
                {errors.gender}
              </div>
            ) : (
              ""
            )}
          </div>
          <div
            className={`relative h-11 w-full min-w-[200px] ${
              sent ? "" : "hidden"
            }`}
          >
            <input
              type="email"
              className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-indigo-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
              placeholder=" "
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <label className="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-indigo-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-900 peer-focus:after:scale-x-100 peer-focus:after:border-indigo-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
              code
            </label>
          </div>
        </div>
        <div className="flex justify-end items-end">
          <button
            className="bg-indigo-700 text-white py-3 px-8 rounded lg:ml-8 hover:bg-blue-900 duration-500"
            onClick={signup}
          >
            {sent ? "confirm" : "send"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAdminForm;
