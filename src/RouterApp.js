import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import App from "./App";

import ProtectedRoute from "./ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";  
import Resetpassword from "./pages/Resetpassword"; 
import AdminDashboard from "./pages/admin/components/AdminDashboard";
import Admin from "./pages/admin/pages/Admin";
import Table from "./pages/admin/Table";
import RegisterAdmin from "./pages/admin/pages/RegisterAdmin";

function RouterApp(){

// récupérer le token Google
const params = new URLSearchParams(window.location.search);
const token = params.get("token");

if(token){
  localStorage.setItem("token", token);
  window.history.replaceState({}, document.title, "/dashboard");
}

return(

<Router>

<Routes>

{/* utilisateur */}
<Route path="/" element={<Login/>} />
<Route path="/register" element={<Register/>} />
<Route path="/forgotpassword" element={<ForgotPassword />} />
<Route path="/resetpassword" element={<Resetpassword/>} />
{/* admin */}
<Route path="/admin" element={<Admin />} />
<Route path="/admin/dashboard" element={<AdminDashboard />} />
<Route path="/registeradmin" element={<RegisterAdmin/>} />
<Route path="/table" element={<Table />} />

{/* dashboard utilisateur */}
<Route
path="/dashboard"
element={
<ProtectedRoute>
<App/>
</ProtectedRoute>
}
/>

{/*  */}
<Route path="*" element={<Login />} />

</Routes>

</Router>

);
}

export default RouterApp;
