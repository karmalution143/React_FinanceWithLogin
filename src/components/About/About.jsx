import React from 'react';
import './About.css';

const About = ({ darkMode }) => {

  return (
    <div className="about-container">
      <header className="about-header">
        <h1>About Aligned Prosperity Network</h1>
      </header>

      <div className="content-wrapper">
        <section className="about-mission">
          <p>
            Our mission is to provide a platform where individuals can learn, grow, and prosper together. By aligning personal values with financial goals, we aim to create a community that values collaboration, diversity, and empowerment. Join us on this journey to financial freedom and fulfillment.
          </p>
        </section>

        <section className="key-themes">
          <ul>
            <li>
              <strong>Alignment:</strong> Ensuring personal values and financial strategies are in harmony.
            </li>
            <li>
              <strong>Prosperity:</strong> Enabling wealth and abundance, not just in finances but in overall life satisfaction.
            </li>
            <li>
              <strong>Network:</strong> Building a supportive, interconnected community where individuals share knowledge, resources, and opportunities.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default About;
