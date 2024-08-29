import React from 'react';
import './Features.css';

const Features = () => {
  return (
    <div className="features-container">
      <section className="features-header">
        <h1>Explore Our Features</h1>
        <p>Discover the advanced functionalities that make our Smart Classroom Management Software stand out.</p>
      </section>

      <section className="features-details">
        <div className="feature-block">
          <div className="feature-image attendance"></div>
          <div className="feature-content">
            <h2>Attendance Automation</h2>
            <p>Our system uses facial recognition and QR code-based check-ins to streamline the attendance process. Teachers and administrators can access real-time attendance reports, ensuring that no student is missed.</p>
          </div>
        </div>

        <div className="feature-block reverse">
          <div className="feature-image resource"></div>
          <div className="feature-content">
            <h2>Resource Management</h2>
            <p>Keep track of classroom resources, including projectors, computers, and other teaching aids, all through a centralized software platform. Automate scheduling and maintenance to minimize downtime and maximize efficiency.</p>
          </div>
        </div>

        <div className="feature-block">
          <div className="feature-image security"></div>
          <div className="feature-content">
            <h2>Safety and Security Alerts</h2>
            <p>Integrated with existing security systems, our software sends real-time alerts during emergencies such as fires or unauthorized access. Ensure the safety of students and staff with quick and reliable notifications.</p>
          </div>
        </div>

        <div className="feature-block reverse">
          <div className="feature-image learning"></div>
          <div className="feature-content">
            <h2>Interactive Learning Tools</h2>
            <p>Enhance the learning experience with tools that integrate seamlessly with smart boards and displays. Provide real-time feedback and analytics on student engagement and performance.</p>
          </div>
        </div>

        <div className="feature-block">
          <div className="feature-image analytics"></div>
          <div className="feature-content">
            <h2>Data Analytics</h2>
            <p>Our system collects and analyzes data on various classroom activities, offering insights into student behavior, attendance patterns, and resource utilization. Make informed decisions with predictive reports to improve educational outcomes.</p>
          </div>
        </div>

        <div className="feature-block reverse">
          <div className="feature-image chatbot"></div>
          <div className="feature-content">
            <h2>AI-based Chatbot</h2>
            <p>Help students identify and address learning gaps with our AI-powered chatbot, which provides instant assistance and personalized learning suggestions.</p>
          </div>
        </div>
        
       

      </section>
    </div>
  );
}

export default Features;
