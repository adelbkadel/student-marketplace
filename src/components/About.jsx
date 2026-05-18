import "../styles/About.css";

function About() {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1>About Student Marketplace</h1>
        <p className="about-intro">
          Student Marketplace is a platform designed for university students to
          buy, sell, exchange, and donate useful academic and daily-life items.
        </p>

        <div className="about-grid">
          <div className="about-card">
            <h3>For Students</h3>
            <p>
              This platform helps students find books, summaries, computers,
              tools, and dorm supplies and lots of other items in one place.
            </p>
          </div>

          <div className="about-card">
            <h3>Smart Exchange</h3>
            <p>
              Students can exchange items instead of only buying or selling,
              which makes the platform more flexible and useful.
            </p>
          </div>

          <div className="about-card">
            <h3>Simple Contact</h3>
            <p>
              Buyers can directly contact sellers using phone numbers or messages and WhatsApp for fast
              and easy communication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;