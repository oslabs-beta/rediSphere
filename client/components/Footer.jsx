import React from 'react';
import logo from '../assets/Github-Logo.jpg';

const Footer = () => {
  return (
    <footer>
      {'rediSphere Open Source ©2024'}
      <a href="https://github.com/oslabs-beta/cache-app/tree/main" target="_blank">
        <img className="github-logo" src={logo}></img>
      </a>
    </footer>
  );
};

export default Footer;
