import InstructionScreen from '../../components/InstructionScreen.jsx';

const instructions = [
  'You will see 5 standard headings at once.',
  'Describe yourself from different perspectives.',
  'Write your descriptions on paper using pen.',
  'One global timer for all headings.',
  'Be honest and introspective in your responses.',
  'Cover all headings within the time limit.'
];

function SDTInstruction() {
  return (
    <InstructionScreen
      title="self description test"
      instructions={instructions}
      duration="5 headings • 15 minutes total"
      testRoute="/test/sdt"
    />
  );
}

export default SDTInstruction;
