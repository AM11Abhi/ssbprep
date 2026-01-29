import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import heroIllustration from '../assets/hero-illustration.png';

function Home() {
  const practiceItems = ['WAT', 'TAT', 'SRT', 'Lecturette', 'More'];

  return (
    <>
      <Navbar />
      <div className="home-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="heading-xl">ssb prep</h1>
            <div className="hero-image-mobile">
              <img 
                src={heroIllustration} 
                alt="SSB candidates illustration" 
                width="265" 
                height="293"
              />
            </div>
            <p className="text-description">
              practice simulator for Services Selection Board (SSB) preparation, 
              designed to help aspirants practice psychology and communication tests 
              under realistic time constraints while closely mirroring actual SSB conditions.
            </p>
            <Link to="/practice" className="btn btn-primary">
              Practice
            </Link>
          </div>
          <div className="hero-image hero-image-desktop">
            <img 
              src={heroIllustration} 
              alt="SSB candidates illustration" 
              width="265" 
              height="293"
            />
          </div>
        </section>

        {/* What You Will Practice Section */}
        <section className="practice-section">
          <h2 className="section-title">what you will practice</h2>
          <div className="practice-pills">
            {practiceItems.map((item) => (
              <span key={item} className="practice-pill">{item}</span>
            ))}
          </div>
        </section>

        {/* How This Helps Section */}
        <section className="benefits-section">
          <h2 className="benefits-title">How this helps your SSB preparation</h2>
          <ul className="benefits-list">
            <li>Practice under real SSB-like time pressure</li>
            <li>Develop clear, structured psychological responses</li>
            <li>Build consistency and confidence through repetition</li>
          </ul>
        </section>
      </div>
      <Footer />
    </>
  );
}

export default Home;
