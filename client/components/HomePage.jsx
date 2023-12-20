import React from 'react';

import Header from './Header';

const HomePage = () => {
  return (
    <div className="home-page">
      <Header />
      <div className="main-content">
        <h1 className="main-content-title">
          Discover critical Redis performance issues in real-time
        </h1>
        <p className="main-content-description">
          Use CacheApp and discover critical performance issues in real-time. View your latency and
          cache-hit-misses all in one place and minimize unpleasant user experiences.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
