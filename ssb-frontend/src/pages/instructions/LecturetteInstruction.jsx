import InstructionScreen from '../../components/InstructionScreen.jsx';

const instructions = [
  'You will see 4 topics displayed.',
  'Select one topic to speak on.',
  'You get 3 minutes to prepare your thoughts.',
  'Then speak for 3 minutes on your chosen topic.',
  'Optional: Record your audio locally (not saved).',
  'This simulates the actual GD/Lecturette experience.'
];

function LecturetteInstruction() {
  return (
    <InstructionScreen
      title="lecturette"
      instructions={instructions}
      duration="3 min prep • 3 min speaking"
      testRoute="/test/lecturette"
    />
  );
}

export default LecturetteInstruction;
