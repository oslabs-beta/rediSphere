import React from 'react';
import Header from './Header';
import Footer from './Footer';
import github from '../assets/Github-Logo.jpg';
import linkedin from '../assets/linked-in.png';

const ContactPage = () => {
  return (
    <div className="contact-page">
      <Header />
      <div className="contact-info-content">
        <div>
          <img
            src="https://cdn.discordapp.com/attachments/1194733878456365229/1194759212849447045/1.png?ex=65b18539&is=659f1039&hm=13b3f51c98bc3a18a3931335f0629ad374b55c10ea9b9f5eac1bc86f60e5722a&"
            alt="Jason"
          />
          <h1>Jason Wong</h1>
          <p>Software Engineer</p>
          <span className="contact-links">
            <a href="https://github.com/Jwong24601" target="_blank">
              <img src={github} />
            </a>
            <a href="https://linkedin.com/in/jason-wong-849a2328" target="_blank">
              <img src={linkedin} />
            </a>
          </span>
        </div>
        <div>
          <img
            src="https://cdn.discordapp.com/attachments/1194733878456365229/1194759515413950564/5.png?ex=65b18582&is=659f1082&hm=4dd8e0a153a731ec3718c3b849d351da8ee378eebd282ce589e8b4099a19f46c&"
            alt="Michelle"
          />
          <h1>Michelle Xie</h1>
          <p>Software Engineer</p>
          <span className="contact-links">
            <a href="https://github.com/mxie97" target="_blank">
              <img src={github} />
            </a>
            <a href="https://www.linkedin.com/in/michelle--x/" target="_blank">
              <img src={linkedin} />
            </a>
          </span>
        </div>
        <div>
          <img
            src="https://cdn.discordapp.com/attachments/1194733878456365229/1194759213134651512/2.png?ex=65b18539&is=659f1039&hm=6ba01359dcc3641466bf08f32158093540768ef41946361637baf72689047bbd&"
            alt="Jake"
          />
          <h1>Jake Kunkel</h1>
          <p>Software Engineer</p>
          <span className="contact-links">
            <a href="https://github.com/jakekunk" target="_blank">
              <img src={github} />
            </a>
            <a href="https://www.linkedin.com/in/jacob-kunkel/" target="_blank">
              <img src={linkedin} />
            </a>
          </span>
        </div>
        <div>
          <img
            src="https://cdn.discordapp.com/attachments/1194733878456365229/1194759213424070746/3.png?ex=65b1853a&is=659f103a&hm=e8363dc7a60103af8a0c4e5fc702fbe6b363be079686a0b1353e56cb89958dbf&"
            alt="Ryan"
          />
          <h1>Ryan Stankowitz</h1>
          <p>Software Engineer</p>
          <span className="contact-links">
            <a href="https://github.com/RyanStankowitz" target="_blank">
              <img src={github} />
            </a>
            <a href="https://www.linkedin.com/in/ryanstankowitz" target="_blank">
              <img src={linkedin} />
            </a>
          </span>
        </div>
        <div>
          <img
            src="https://cdn.discordapp.com/attachments/1194733878456365229/1194759213654753280/4.png?ex=65b1853a&is=659f103a&hm=ab8b5cb46a7ae8202c1dfe25d1b387cfde1ff7a27afd44f51bcd10a19dfdc97e&"
            alt="Eduardo"
          ></img>
          <h1>Eduardo Uribe</h1>
          <p>Software Engineer</p>
          <span className="contact-links">
            <a href="https://github.com/eduardo-uribe" target="_blank">
              <img src={github} />
            </a>
            <a href="https://www.linkedin.com/in/eduardo-javier-uribe/" target="_blank">
              <img src={linkedin} />
            </a>
          </span>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
