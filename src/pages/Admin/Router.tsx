
// AppRouter.tsx (qismi)
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./Adminlogin";
import AdminDashboard from "./AdminDashboard";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  return token ? <>{children}</> : <Navigate to="/admin/login" />;
};

const AppRouter = () => {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route 
        path="/admin/dashboard" 
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/admin/*" 
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
};

export default AppRouter;
