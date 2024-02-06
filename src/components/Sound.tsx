import React, { useContext } from 'react';
import { SoundContext } from '../store';

const Sound = () => {
  const { isSound, setIsSound } = useContext(SoundContext);

  return (
    <button
      type="button"
      className={`icon${isSound ? ' soundOpen' : ' soundClose'}`}
      onClick={() => setIsSound(!isSound)}
    />
  );
};

export default Sound;
