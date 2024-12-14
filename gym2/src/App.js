import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage'; // Import HomePage
import AuthForm from './components/AuthForm'; // Import the form component
import AdminDashboard from './components/AdminDashboard'; // Import the AdminDashboard
import UserDashboard from './components/UserDashboard'; // Import UserDashboard

function App() {
  return (
    <div className="App">
      {/* Routes Setup */}
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Home Page */}
        <Route path="/login" element={<AuthForm isLogin={true} />} /> {/* Login Form */}
        <Route path="/register" element={<AuthForm isLogin={false} />} /> {/* Register Form */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* Admin Dashboard */}
        <Route path="/user-dashboard" element={<UserDashboard />} /> {/* User Dashboard */}
      </Routes>
    </div>
  );
}

export default App;
