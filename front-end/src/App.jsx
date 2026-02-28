import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./dashboard/DashboardLayout";
import DashboardHome from "./dashboard/pages/DashboardHome";
import AddFarmhouse from "./dashboard/pages/AddFarmhouse";
import AddAdmin from "./dashboard/pages/AddAdmin";
import ViewUsers from "./dashboard/pages/ViewUsers";
import Login from "./public/pages/Login";
import ViewFarmhouse from "./dashboard/pages/ViewFarmhouse";
import Home from "./public/pages/Home";
import Register from "./public/pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* DASHBOARD ROUTES */}
        <Route path="/super-admin" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="add-farmhouses" element={<AddFarmhouse />} />
          <Route path="add-users" element={<AddAdmin />} />
          <Route path="view-users" element={<ViewUsers />} />
          <Route path="edit-farmhouse/:id" element={<AddFarmhouse />} />
          <Route path="view-farmhouses" element={<ViewFarmhouse />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <>
      <h1 style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "red" }}>
        Not Found
      </h1>
    </>
  )
}

export default App;
