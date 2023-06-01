import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import LoginFormImage from "../../assets/LoginFormImage.png";
import PersonService from "../../service/PersonServices";

const MIN_PASSWORD_LENGTH = 8;

function LoginForm({ nav }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    pw: "",
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user data"));
    if (data) {
      navigate(`/${data.type}`);
    }
  }, []);

  const formValidation = () => {
    let status = true;
    let localErrors = { email: "", pw: "" };

    if (!email.trim()) {
      localErrors.email = "Email is required.";
      status = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      localErrors.email = "Invalid email address.";
      status = false;
    }

    if (!pw.trim()) {
      localErrors.pw = "Password is required.";
      status = false;
    } else if (pw.length < MIN_PASSWORD_LENGTH) {
      localErrors.pw = `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
      status = false;
    }

    setErrors(localErrors);
    return status;
  };

  const signin = async (e) => {
    e.preventDefault();
    if (formValidation()) {
      const data = {
        email: email,
        pw: pw,
      };
      try {
        const response = await PersonService.signin(data);

        setEmail("");
        setPw("");
        const UserData = JSON.parse(atob(response.data.token.split(".")[1]));
        console.log(`on machine ${UserData.machine}`);
        localStorage.setItem("token", JSON.stringify(response.data.token));
        localStorage.setItem("user data", JSON.stringify(UserData));
        navigate(`/${UserData.type}`);
      } catch (err) {
        toast.error(err.response.data.message);
      }
    } else {
      toast.error("form invalid");
    }
  };
  return (
    <div className="w-full p-6 m-auto bg-slate-200 rounded-md drop-shadow-2xl lg:max-w-2xl">
      <h1 className="absolute -top-10 text-6xl ml-48 font-semibold text-indigo-800">
        Sign in
      </h1>
      <form className="flex" onSubmit={signin}>
        <div className="flex flex-col justify-center gap-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-800"
            >
              Email
              <input
                label="email"
                type="email"
                className="border-blue-200 block w-full px-4 py-2 mt-2 text-gray-800 bg-slate-50 border rounded-md focus:border-blue-600 focus:ring-blue-200 focus:outline-none focus:ring focus:ring-opacity-40"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            {errors.email != " " ? (
              <div className="text-orange-600 text-xs">{errors.email}</div>
            ) : (
              ""
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-800"
            >
              Password
              <input
                type="password"
                className="border-blue-200 block w-full px-4 py-2 mt-2 text-gray-800 bg-slate-50 border rounded-md focus:border-blue-600 focus:ring-blue-200 focus:outline-none focus:ring focus:ring-opacity-40"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
              />
            </label>
            {errors.pw != " " ? (
              <div className="text-orange-600 text-xs">{errors.pw}</div>
            ) : (
              ""
            )}
          </div>
          <button
            className="text-center w-72 transition duration-500 bg-indigo-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
            onClick={signin}
          >
            Login
          </button>
          <button
            onClick={nav}
            className="text-xs text-blue-600 hover:underline"
          >
            Forget Password?
          </button>
        </div>
        <div>
          <img src={LoginFormImage} alt="doc" className="object-cover h-88 w-96" />
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
