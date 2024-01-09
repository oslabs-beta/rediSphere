import React from 'react';
import { useNavigate } from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';

import whiteLogo from '../assets/white-background-redisphere-logo.png';

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="home-page">
      <Header />
      <div className="main-content">
        <div className="intro">
          <div className="intro-left">
            <img id="intro-logo" src={whiteLogo}></img>
            <h1>
              Monitor your Redis performance metrics with <em>rediSphere</em>.
            </h1>
            <button onClick={() => navigate('/signup')}>Get Started</button>
          </div>
          <img id="example" className="key-feature"></img>
        </div>

        <div className="key-features-container">
          <div className="key-feature">
            <h2>Placeholder</h2>
            <p>description</p>
          </div>
          <div className="key-feature">
            <h2>Visualize Live Redis Metrics</h2>
            <p>
              rediSphere offers live Redis performance visualization in an intuitive, user-friendly
              dashboard. Developers can easily diagnose and resolve performance issues.
            </p>
          </div>
          <div className="key-feature">
            <h2>Placeholder</h2>
            <p>description</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
