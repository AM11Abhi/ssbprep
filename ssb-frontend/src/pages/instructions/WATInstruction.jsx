import InstructionScreen from '../../components/InstructionScreen.jsx';

const instructions = [
  'You will be shown 60 words, one at a time.',
  'Each word appears for exactly 15 seconds.',
  'Write your response on paper using pen.',
  'Words auto-advance—no pausing or going back.',
  'Write the first sentence that comes to mind.',
  'Keep your responses natural and spontaneous.'
];

function WATInstruction() {
  return (
    <InstructionScreen
      title="word association test"
      instructions={instructions}
      duration="60 words • 15 minutes total"
      testRoute="/test/wat"
    />
  );
}

export default WATInstruction;
