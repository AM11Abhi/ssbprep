import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Practice from './pages/Practice.jsx';
import About from './pages/About.jsx';
import Completed from './pages/Completed.jsx';
import WATInstruction from './pages/instructions/WATInstruction.jsx';
import TATInstruction from './pages/instructions/TATInstruction.jsx';
import SRTInstruction from './pages/instructions/SRTInstruction.jsx';
import SDTInstruction from './pages/instructions/SDTInstruction.jsx';
import LecturetteInstruction from './pages/instructions/LecturetteInstruction.jsx';
import WATTest from './pages/tests/WATTest.jsx';
import TATTest from './pages/tests/TATTest.jsx';
import SRTTest from './pages/tests/SRTTest.jsx';
import SDTTest from './pages/tests/SDTTest.jsx';
import LecturetteTest from './pages/tests/LecturetteTest.jsx';
import NotFound from './pages/NotFound.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/about" element={<About />} />
        <Route path="/completed" element={<Completed />} />
        
        <Route path="/practice/wat" element={<WATInstruction />} />
        <Route path="/practice/tat" element={<TATInstruction />} />
        <Route path="/practice/srt" element={<SRTInstruction />} />
        <Route path="/practice/sdt" element={<SDTInstruction />} />
        <Route path="/practice/lecturette" element={<LecturetteInstruction />} />
        
        <Route path="/test/wat" element={<WATTest />} />
        <Route path="/test/tat" element={<TATTest />} />
        <Route path="/test/srt" element={<SRTTest />} />
        <Route path="/test/sdt" element={<SDTTest />} />
        <Route path="/test/lecturette" element={<LecturetteTest />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
