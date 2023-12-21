import React from 'react';

import Header from './Header';
import Footer from './Footer';

const HomePage = () => {
  return (
    <div className="home-page">
      <Header />
      <div className="main-content">
        <h1>Discover critical Redis performance issues in real-time</h1>
        <p>
          Use CacheApp and discover critical performance issues in real-time. View your latency and
          cache-hit-misses all in one place and minimize unpleasant user experiences.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
