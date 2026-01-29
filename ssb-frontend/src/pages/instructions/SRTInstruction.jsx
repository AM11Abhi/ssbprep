import InstructionScreen from '../../components/InstructionScreen.jsx';

const instructions = [
  'You will face 60 situational scenarios.',
  'Total time allowed is 30 minutes.',
  'One situation is displayed at a time.',
  'You may skip situations if needed.',
  'Write your responses on paper using pen.',
  'Manage your time wisely across all situations.'
];

function SRTInstruction() {
  return (
    <InstructionScreen
      title="situation reaction test"
      instructions={instructions}
      duration="60 situations • 30 minutes total"
      testRoute="/test/srt"
    />
  );
}

export default SRTInstruction;
