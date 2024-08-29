import React from 'react';
import './About.css';

const AboutUs = () => {
  return (
    <div className="about-container">
      <section className="about-hero">
        <h1>About Our Smart Classroom Management Software</h1>
        <p>Empowering Education with Technology for a Better Learning Environment.</p>
      </section>

      <section className="features">
        <h2>Our Key Features</h2>
        <div className="feature-list">
          <div className="feature-item">
            <h3>Attendance Automation</h3>
            <p>Facial recognition and QR code-based attendance tracking with real-time reports.</p>
          </div>
          <div className="feature-item">
            <h3>Resource Management</h3>
            <p>Centralized tracking and scheduling of classroom resources to minimize downtime.</p>
          </div>
          <div className="feature-item">
            <h3>Safety and Security Alerts</h3>
            <p>Emergency alerts integrated with existing security systems for real-time notifications.</p>
          </div>
          <div className="feature-item">
            <h3>Interactive Learning Tools</h3>
            <p>Integration with smart boards and displays for real-time feedback and student engagement.</p>
          </div>
          <div className="feature-item">
            <h3>Data Analytics</h3>
            <p>Analyze classroom data to gain insights into student behavior and resource utilization.</p>
          </div>
          <div className="feature-item">
            <h3>AI-based Chatbot</h3>
            <p>AI-powered chatbot to help students understand their learning gaps and provide assistance.</p>
          </div>
          <div className="feature-item">
            <h3>Quizzes and Leaderboards</h3>
            <p>Engage students with quizzes and leaderboards to foster a competitive learning environment.</p>
          </div>
          <div className="feature-item">
            <h3>eBook Facilities</h3>
            <p>Teachers can add free or paid eBooks. Students can order hard copies of eBooks.</p>
          </div>
          <div className="feature-item">
            <h3>Study Groups</h3>
            <p>Facilitate group studies with our easy-to-use group management feature.</p>
          </div>
          <div className="feature-item">
            <h3>Session Recording</h3>
            <p>Record teaching sessions for students to watch later at their convenience.</p>
          </div>
          <div className="feature-item">
            <h3>Canvas for Notes</h3>
            <p>A digital canvas for students and teachers to write and save notes.</p>
          </div>
          <div className="feature-item">
            <h3>Chatting Facility</h3>
            <p>Real-time chatting feature for students and teachers to interact effectively.</p>
          </div>
        </div>
      </section>

      <section className="about-mission">
        <h2>Our Mission</h2>
        <p>To revolutionize classroom management by providing advanced software solutions that enhance operational efficiency, ensure safety, and create an engaging learning atmosphere for students.</p>
      </section>
    </div>
  );
}

export default AboutUs;
