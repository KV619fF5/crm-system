import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Activities from "./pages/Activities";
import Leads from "./pages/Leads";
import Deals from "./pages/Deals";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [user, setUser] = useState(() => {
    // Load user from localStorage if available
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const isAuthenticated = !!user;

  return (
    <Router>
      <div className="flex">
        {isAuthenticated && <Sidebar />}
        <div className={`flex-1 p-6 min-h-screen ${isAuthenticated ? "bg-gray-100" : "bg-white"}`}>
          <Routes>
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route 
              path="/" 
              element={isAuthenticated ? <Dashboard setUser={setUser} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/customers" 
              element={isAuthenticated ? <Customers /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/activities" 
              element={isAuthenticated ? <Activities /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/leads" 
              element={isAuthenticated ? <Leads /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/deals" 
              element={isAuthenticated ? <Deals /> : <Navigate to="/login" />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
