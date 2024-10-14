// src/App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminDashboard from './components/AdminComponents/AdminDashboard';
import EmployeeDashboard from './components/EmployeeComponents/EmployeeDashboard'; // Import Employee Dashboard
import ProtectedRoute from './components/ProtectedRoute';
import 'primereact/resources/themes/saga-blue/theme.css'; 
import 'primeicons/primeicons.css';


function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect the root path ("/") to the login page */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        <Route path="/login" element={<Login />} />
        
        {/* Protect the dashboard routes */}
        <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/employee-dashboard" element={<ProtectedRoute><EmployeeDashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
