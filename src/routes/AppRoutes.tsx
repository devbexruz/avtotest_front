// src/AppRoutes.tsx (to'liq versiya)
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home/Home";
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
import ExamSolveTest from "../pages/Dashboard/Exam/ExamSolve";

// Admin komponentlarini import qilish
import AdminLogin from "../pages/Admin/Adminlogin";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import TestResult from "../pages/Dashboard/TestResult";
// Admin route protection
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const adminToken = localStorage.getItem("token");
  return adminToken ? <>{children}</> : <Navigate to="/admin/login" />;
};

const AppRoutes = ({ auth }: { auth: boolean }) => {
  console.log("salom:", auth);
  
  return (
    <Routes>
      {/* User Routes */}
      {auth ? (
        <Route path="/" element={<Dashboard />} />
      ) : (
        <Route path="/" element={<Home />} />
      )}
      {auth && <Route path="/themes" element={<Themes />} />}
      {auth && <Route path="/tickets" element={<Tickets />} />}
      {auth && <Route path="/settests" element={<SetTests />} />}
      {auth && <Route path="/testresult/:result_id" element={<SolveTest />} />}
      {auth && <Route path="/exam" element={<ExamAutoStart />} />}
      {auth && <Route path="/exam/:result_id" element={<ExamSolveTest />} />}
      {auth && <Route path="/statistics" element={<Statistics />} />}
      {auth && <Route path="/test_result/:result_id" element={<TestResult />} />}


      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
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