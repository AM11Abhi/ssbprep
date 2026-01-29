import Navbar from '../components/Navbar.jsx';

function About() {
  return (
    <>
      <Navbar />
      <div className="page-container">
        <h1 className="heading-lg">about</h1>
        
        <div className="about-content">
          <p>
            This platform simulates real SSB test conditions and is meant only for practice. 
            It does not evaluate, score, analyze, or store answers.
          </p>
          
          <p>
            All responses are written on pen and paper, not typed on the website. 
            This maintains the authentic SSB experience where candidates respond 
            through handwritten answers.
          </p>
          
          <p>
            The tests follow strict time constraints identical to actual SSB assessments. 
            Auto-advance functionality ensures you practice under realistic pressure 
            without the ability to pause or extend time.
          </p>
          
          <p>
            Core philosophy: Discipline over convenience. No gamification, no scoring, 
            no analytics, no AI judgment. Just pure, focused practice.
          </p>
        </div>
      </div>
    </>
  );
}

export default About;
