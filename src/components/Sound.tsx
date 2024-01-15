import React, { useContext } from 'react';
import { SoundContext } from '../store';

const Sound = () => {
  const { isSound, setIsSound } = useContext(SoundContext);

  return (
    <button
      type="button"
      className={`btn${isSound ? ' soundOpen' : ' soundClose'}`}
      onClick={() => setIsSound(!isSound)}
    />
  );
};

export default Sound;
