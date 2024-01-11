import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Header from './Header';
import Footer from './Footer';

import whiteLogo from '../assets/white-background-redisphere-logo.png';
import demoGif from '../assets/demo2.gif';

const HomePage = () => {
  const navigate = useNavigate();
  const userLoginStatus = useSelector((store) => store.dashboard.loggedIn);
  let bigButton;
  if (!userLoginStatus) {
    bigButton = <button onClick={() => navigate('/signup')}>Get Started</button>;
  } else {
    bigButton = <button onClick={() => navigate('/dashboard')}>Take me to my dashboard</button>;
  }
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
            {bigButton}
          </div>
          <img id="demo-gif" className="key-feature" src={demoGif}></img>
        </div>

        <div className="key-features-container">
          <div className="key-feature">
            <h2>Real-time Monitoring</h2>
            <p>
              Easily diagnose and resolve performance issues with charts that update every second.
              Visualize your Redis memory usage, hit and miss ratios, eviction and expiration
              statistics, and average latency.
            </p>
          </div>
          <div className="key-feature">
            <h2>Customizable Dashboard</h2>
            <p>
              rediSphere offers live Redis performance visualization in an intuitive, user-friendly
              dashboard. Mix and match which widgets and charts matter most to you.
            </p>
          </div>
          <div className="key-feature">
            <h2>Quick and Easy Setup</h2>
            <p>
              Simply make an account and enter your Redis host, port, and password to instantly
              connect and start viewing your Redis metrics!
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
