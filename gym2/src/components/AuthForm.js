import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './AuthForm.css';

function AuthForm({ isLogin }) {
  const navigate = useNavigate(); // Initialize the navigate function
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      // Login logic (fetch from backend)
      if (formData.email && formData.password) {
        try {
          const response = await fetch('http://localhost:8888/user/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          });

          if (!response.ok) {
            throw new Error('Invalid credentials');
          }

          const data = await response.json();
          alert('Login successful!');
          // Redirect based on user role (e.g., admin or regular user)
          if (data.isAdmin === 1) {
            navigate('/admin-dashboard'); // Navigate to admin dashboard
          } else {
            navigate('/user-dashboard'); // Navigate to user dashboard
          }
        } catch (error) {
          alert('Login failed. Please try again.');
        }
      } else {
        alert('Please fill in all fields.');
      }
    } else {
      // Registration logic (fetch from backend)
      if (formData.name && formData.email && formData.password) {
        try {
          const response = await fetch('http://localhost:8888/user/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              password: formData.password,
            }),
          });
          
          
          if (!response.ok) {
            throw new Error('Registration failed');
          }
          
          const data = await response.json();
          if (data.message) {
          alert(data.message);
          navigate('/login');
        } 
      } catch (error) {
          alert(error.message);
      }
      } else {
        alert('Please fill in all fields.');
      }
    }
  };

  return (
    <div className="page-container">
      <div className="left-side">
        {/* Placeholder for additional content, if needed */}
      </div>

      <div className="right-side">
        <div className="auth-form">
          <h2>{isLogin ? 'Login' : 'Register'}</h2>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label>Name:</label>
                <input
                  className="input-field"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              </div>
            )}
            <div>
              <label>Email:</label>
              <input
                className="input-field"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                className="input-field"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </div>
            <button className="submit-btn" type="submit">
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>
          <button
            className="switch-btn"
            onClick={() => alert(isLogin ? 'Switch to Register' : 'Switch to Login')}
          >
            {isLogin ? 'Create an account' : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;