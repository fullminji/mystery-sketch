import React, { ReactNode, useMemo, useState } from 'react';

interface ChildrenProps {
  children: ReactNode;
}
interface ContextValue {
  isSound: boolean;
  setIsSound: (isSound: boolean) => void;
}

export const SoundContext = React.createContext<ContextValue>({
  isSound: false,
  setIsSound: () => {},
});

const Container: React.FC<ChildrenProps> = ({ children }) => {
  const [isSound, setIsSound] = useState<boolean>(false);
  const value = useMemo(() => ({ isSound, setIsSound }), [isSound, setIsSound]);

  return (
    <SoundContext.Provider value={value}>
      {children}
      {isSound && <audio src="/sound/bgm.mp3" autoPlay={true} />}
    </SoundContext.Provider>
  );
};

export default Container;
