import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

const tests = [
  {
    id: 'wat',
    title: 'Word Association Test',
    meta: ['60 words', '15 minutes'],
    route: '/practice/wat'
  },
  {
    id: 'tat',
    title: 'Thematic Apperception Test (TAT)',
    meta: ['12 pictures', '30 seconds to observe', '4 minutes to write'],
    route: '/practice/tat'
  },
  {
    id: 'srt',
    title: 'Situation Reaction Test (SRT)',
    meta: ['60 situations', '30 minutes total duration'],
    route: '/practice/srt'
  },
  {
    id: 'lecturette',
    title: 'Lecturette',
    meta: ['4 topics displayed', 'choose and speak for', '3 minutes'],
    route: '/practice/lecturette'
  },
  {
    id: 'sdt',
    title: 'Self Description Test (SDT)',
    meta: ['5 standard headings'],
    route: '/practice/sdt'
  }
];

function Practice() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h1 className="heading-lg">practice</h1>
        
        <div className="cards-grid">
          {tests.map((test) => (
            <div 
              key={test.id} 
              className="card"
              onClick={() => navigate(test.route)}
            >
              <h3 className="card-title">{test.title}</h3>
              <div className="card-meta">
                {test.meta.map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Practice;
