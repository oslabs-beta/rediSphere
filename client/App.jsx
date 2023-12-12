import * as d3 from 'd3';
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './styles.css';
import LoginPage from './components/LoginPage.jsx';
import SignupPage from './components/SignupPage.jsx';
import DashBoard from './components/DashBoard.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<DashBoard />} />
    </Routes>
  );
};
export default App;
