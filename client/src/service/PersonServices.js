import axios from "axios";

const PersonService = {};

// create a sys admin if theere are no sysadmin accounts
PersonService.signup = function (data) {
  return axios.post("http://localhost:5000/sysadmin/signup", data);
};

PersonService.confirm = function (data) {
  return axios.post("http://localhost:5000/sysadmin/confirm", data);
};

// signin for all types of accounts
PersonService.signin = function (data) {
  return axios.post("http://localhost:5000/signin", data);
};

// create doctor
PersonService.createDoctor = function (data) {
  return axios.post("http://localhost:5000/doctor/create", data, {
    headers: { authorization: JSON.parse(localStorage.getItem("token")) },
  });
};

//

PersonService.createSysAdmin = function (data) {
  return axios.post("http://localhost:5000/sysadmin/create", data, {
    headers: { authorization: JSON.parse(localStorage.getItem("token")) },
  });
};

PersonService.createUnit = function (data) {
  return axios.post("http://localhost:5000/unit/create", data, {
    headers: { authorization: JSON.parse(localStorage.getItem("token")) },
  });
};

PersonService.createLab = function (data) {
  return axios.post("http://localhost:5000/lab/create", data, {
    headers: { authorization: JSON.parse(localStorage.getItem("token")) },
  });
};

PersonService.AddUnitCampaign = function (data) {
  return axios.post("http://localhost:5000/sysadmin/campaign/unit/add", data, {
    headers: { authorization: JSON.parse(localStorage.getItem("token")) },
  });
};

PersonService.removeUnitCampaign = function (data) {
  return axios.post(
    "http://localhost:5000/sysadmin/campaign/unit/remove",
    data,
    { headers: { authorization: JSON.parse(localStorage.getItem("token")) } }
  );
};

PersonService.AddUnitLab = function (data) {
  return axios.post("http://localhost:5000/sysadmin/unit/lab/add", data, {
    headers: { authorization: JSON.parse(localStorage.getItem("token")) },
  });
};

PersonService.removeUnitLab = function (data) {
  return axios.post("http://localhost:5000/sysadmin/unit/lab/remove", data, {
    headers: { authorization: JSON.parse(localStorage.getItem("token")) },
  });
};

PersonService.AddUnitDoc = function (data) {
  return axios.post("http://localhost:5000/sysadmin/unit/doc/add", data, {
    headers: { authorization: JSON.parse(localStorage.getItem("token")) },
  });
};

PersonService.removeUnitDoc = function (data) {
  return axios.post("http://localhost:5000/sysadmin/unit/doc/remove", data, {
    headers: { authorization: JSON.parse(localStorage.getItem("token")) },
  });
};

PersonService.createSubject = function (data) {
  return axios.post("http://localhost:5000/subject/create", data, {
    headers: { authorization: JSON.parse(localStorage.getItem("token")) },
  });
};

export default PersonService;
