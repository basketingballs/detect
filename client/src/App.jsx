import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage/HomePage";
import Loading from "./pages/Skeletons/Loading";
import SysAdminLoading from "./pages/Skeletons/SysAdminLoading";
import UnitDocLoading from "./pages/Skeletons/UnitDocLoading"
const Login = lazy(() => import("./pages/Login/Login"));
const SysAdmin = lazy(() => import("./pages/SysAdmin/SysAdmin"));
const Doctor = lazy(() => import("./pages/Doctor/Doctor"));

const LoginComponent = () => (
  <Suspense fallback={<Loading />}>
    <Login />
  </Suspense>
);

const SysAdminComponent = () => (
  <Suspense fallback={<SysAdminLoading />}>
    <SysAdmin />
  </Suspense>
);

const DoctorComponent = () => (
  <Suspense fallback={<UnitDocLoading />}>
    <Doctor />
  </Suspense>
);

function App() {
  return (
    <Routes>
      <Route path="/" exact element={<HomePage />}></Route>
      <Route path="login" exact element={<LoginComponent />}></Route>
      <Route path="sysadmin" exact element={<SysAdminComponent />}></Route>
      <Route path="doctor" exact element={<DoctorComponent />}></Route>
    </Routes>
  );
}

export default App;