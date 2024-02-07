const Start = ({ handleStart }: { handleStart: () => void }) => {
  return (
    <div className="start">
      <button onClick={handleStart}>GameStart</button>
    </div>
  );
};

export default Start;
