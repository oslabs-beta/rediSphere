import React from 'react';
import Header from './Header';
import Footer from './Footer';

const ContactPage = () => {
  return (
    <div className="home-page">
      <Header />
      <div className="main-content">
        <h1>Contributors</h1>
        <p>Jason Wong</p>
        <p>Michelle Xie</p>
        <p>Jake Kunkel</p>
        <p>Ryan Stankowitz</p>
        <p>Eduardo Uribe</p>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
