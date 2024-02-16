import { useEffect, useRef, useState } from 'react';
import close from '../style/images/icon/close.png';
import { UserInfo } from './User';

const Result = ({ userInfo }: { userInfo: UserInfo[] }) => {
  const [rank, setRank] = useState(userInfo);

  const [isToggled, setIsToggled] = useState<boolean>(true);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isToggled) {
      const rankData = [...userInfo].sort((a, b) => b.score - a.score);
      setRank(rankData);
    }
  }, [userInfo, isToggled]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsToggled(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectRef]);

  return (
    <div className="result">
      {isToggled && (
        <div className="resultArea">
          <div className="resultGroup">
            <div className="closeArea">
              <img src={close} alt="닫기" onClick={() => setIsToggled(false)} />
            </div>
            <div className="resultContainer">
              <h2>SCORE</h2>
              <h3>{rank[0]?.username}님이 우승자가 되었습니다!</h3>
              <div className="rankResultGroup">
                <ul className="rankResult">
                  {rank.map((rankData, index) => (
                    <li key={index}>
                      <span className="rank">{index + 1}등</span>
                      <span className="name">{rankData.username}</span>
                      <span className="point">{rankData.score}P</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button className="checkBtn" onClick={() => setIsToggled(false)}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Result;
