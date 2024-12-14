import React from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';

function HomePage() {
  return (
    <div className="home-page">
      {/* Burger Menu */}
      <Menu>
        <a href="#">Contact us</a>
        <a href="#">About</a>
        <a href="#">Location</a>
      </Menu>

      {/* Home Page Content */}
      <header className="header">
        <h1 className="gym-name">ICONFIT</h1>
      </header>

      <p className="slogan">FITNESS AND BEYOND</p>

      {/* Custom Box for Navigation */}
      <div className="custom-box">
        <Link to="/login">
          <button className="auth-button">Login</button>
        </Link>
        <Link to="/register">
          <button className="auth-button">Register</button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;

