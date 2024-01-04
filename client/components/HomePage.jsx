import React from 'react';

import Header from './Header';
import Footer from './Footer';

const HomePage = () => {
  return (
    <div className="home-page">
      <Header />
      <div className="main-content">
        <h1>Discover critical Redis performance issues in real-time with Cache App</h1>
        <h3>Background</h3>
        <p>
          Redis databases are often used by developers as a caching database. Monitoring performance
          metrics is critical to production and development to optimize cache performance.
          Developers will want to monitor their database metrics in real time to quickly resolve
          issues, but current Redis tools are more focused on database administration, and metrics
          graphs are not customizable.
        </p>
        <h3>Our Solution</h3>
        <p>
          We've created a web app with a simple, intuitive UI to allow users to customize and view
          the relevant Redis performance metrics to their project.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
