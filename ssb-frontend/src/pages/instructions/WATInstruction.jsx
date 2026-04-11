import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InstructionScreen from '../../components/InstructionScreen.jsx';
import TestModeDialog from '../../components/TestModeDialog.jsx';

const instructions = [
  'You will be shown 60 words, one at a time.',
  'Each word appears for exactly 15 seconds.',
  'Interactive mode: Type your sentence.',
  'Practice mode: Write your response on paper.',
  'Words auto-advance—no pausing or going back.',
  'Write the first sentence that comes to mind.',
  'Keep your responses natural and spontaneous.'
];

function WATInstruction() {
  const [showModeDialog, setShowModeDialog] = useState(false);
  const navigate = useNavigate();

  const handleModeSelect = (mode) => {
    setShowModeDialog(false);
    
    // Request fullscreen upon start
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }

    navigate('/test/wat', { state: { mode } });
  };

  return (
    <>
      <InstructionScreen
        title="word association test"
        instructions={instructions}
        duration="60 words • 15 minutes total"
        testRoute="/test/wat"
        customStartHandler={() => setShowModeDialog(true)}
      />

      <TestModeDialog
        isOpen={showModeDialog}
        onSelect={handleModeSelect}
        onClose={() => setShowModeDialog(false)}
      />
    </>
  );
}

export default WATInstruction;
