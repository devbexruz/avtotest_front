// src/AppRoutes.tsx (to'liq versiya)
import { Routes, Route, Navigate } from "react-router-dom";
// import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Login from "../pages/Auth/Login";
import NotFound from "../pages/Others/NotFound";
import Connections from "../pages/Others/Connections";
import Dashboard from "../pages/Dashboard/Dashboard";
import Themes from "../pages/Dashboard/ByTheme/ByTheme";
import Tickets from "../pages/Dashboard/ByTicket/ByTicket";
import SetTests from "../pages/Dashboard/SetTests/SetTests";
import SolveTest from "../pages/Dashboard/Solve";
import Statistics from "../pages/Dashboard/Statistics";
import ExamAutoStart from "../pages/Dashboard/Exam/Exam";

// Admin komponentlarini import qilish
import AdminDashboard from "../pages/Admin/AdminDashboard";
import TestResult from "../pages/Dashboard/TestResult";
// Admin route protection
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const adminToken = localStorage.getItem("token");
  return adminToken ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes = ({ auth }: { auth: boolean }) => {
  console.log("salom:", auth);
  
  return (
    <Routes>
      {/* User Routes */}
      <Route path="/" element={<Dashboard />} />
      {/* {auth ? (
        <Route path="/" element={<Dashboard />} />
      ) : (
        <Route path="/" element={<Home />} />
      )} */}
      <Route path="/themes" element={auth ? <Themes /> : <Login />} />
      <Route path="/tickets" element={auth ? <Tickets />: <Login />} />
      <Route path="/settests" element={auth ? <SetTests />:<Login />} />
      <Route path="/testresult/:result_id" element={auth ? <SolveTest />:<Login />} />
      <Route path="/exam" element={auth ? <ExamAutoStart />:<Login />} />
      <Route path="/statistics" element={auth ? <Statistics />:<Login />} />
      <Route path="/test_result/:result_id" element={auth ? <TestResult />:<Login />} />


      {/* Admin Routes */}
      <Route 
        path="/admin/dashboard" 
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/*" 
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } 
      />

      {/* Public Routes */}
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/connections" element={<Connections />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;