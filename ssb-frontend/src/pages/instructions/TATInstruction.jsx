import InstructionScreen from '../../components/InstructionScreen.jsx';

const instructions = [
  'You will see 12 pictures, including one blank slide.',
  'Each picture is shown for 30 seconds to observe.',
  'After observation, you get 4 minutes to write your story.',
  'Write your story on paper using pen.',
  'The test auto-advances—no pausing allowed.',
  'For the blank slide, write any story you imagine.'
];

function TATInstruction() {
  return (
    <InstructionScreen
      title="thematic apperception test"
      instructions={instructions}
      duration="12 pictures • ~54 minutes total"
      testRoute="/test/tat"
    />
  );
}

export default TATInstruction;
