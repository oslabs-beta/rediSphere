import * as d3 from 'd3';
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './styles.css';

import HomePage from './components/HomePage.jsx';
import LoginPage from './components/LoginPage.jsx';
import SignupPage from './components/SignupPage.jsx';
import DashBoard from './components/DashBoard.jsx';
import ConnectRedisPage from './components/ConnectRedis.jsx';
import ContactPage from './components/Contact.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/connectredis" element={<ConnectRedisPage />} />
      <Route path="/dashboard" element={<DashBoard />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  );
};
export default App;
