import React from 'react';

import Header from './Header';
import Footer from './Footer';

const HomePage = () => {
  return (
    <div className="home-page">
      <Header />
      <div className="main-content">
        <h1>Do you like visualizing Redis metrics?</h1>
        <h3>We have just the app for you.</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
