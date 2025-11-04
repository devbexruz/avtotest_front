import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './utils/auth';
import Home from './pages/Home/Home';
import './styles/globals.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return !isAuthenticated() ? <>{children}</> : <Navigate to="/profile" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Home />
                {/* <Login /> */}
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Home />
                {/* <Register /> */}
              </PublicRoute>
            } 
          />

          {/* Protected routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Home />
                {/* <Layout>
                  <Profile />
                </Layout> */}
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tests/themes" 
            element={
              <ProtectedRoute>

                <Home />
                {/* <Layout>
                  <ThemeTests />
                </Layout> */}
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tests/exam" 
            element={
              <ProtectedRoute>
                <Home />
                {/* <Layout>
                  <ExamTest />
                </Layout> */}
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tests/custom" 
            element={
              <ProtectedRoute>
                <Home />
                {/* <Layout>
                  <CustomTest />
                </Layout> */}
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tests/tickets" 
            element={
              <ProtectedRoute>
                <Home />
                {/* <Layout>
                  <TicketTests />
                </Layout> */}
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/statistics" 
            element={
              <ProtectedRoute>
                <Home />
                {/* <Layout>
                  <Statistics />
                </Layout> */}
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;