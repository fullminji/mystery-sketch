import { useEffect, useRef, useState } from 'react';
import close from '../style/images/icon/close.png';

const Result = () => {
  const resultData = [
    {
      rank: 1,
      userName: '유저1등',
      point: 1000,
    },
    {
      rank: 2,
      userName: '유저11',
      point: 900,
    },
    {
      rank: 3,
      userName: '유저이름일이삼사오',
      point: 800,
    },
    {
      rank: 4,
      userName: '유저test',
      point: 710,
    },
    {
      rank: 5,
      userName: '유저test02',
      point: 210,
    },
    {
      rank: 6,
      userName: '유저test03',
      point: 10,
    },
    {
      rank: 7,
      userName: '유저test04',
      point: 1,
    },
    {
      rank: 8,
      userName: '유저test05',
      point: 0,
    },
  ];

  const [isToggled, setIsToggled] = useState<boolean>(true);
  const selectRef = useRef<HTMLDivElement>(null);
  const winner = resultData[0].userName;

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
              <h3>{winner}님이 방장이 되었습니다!</h3>
              <div className="rankResultGroup">
                <ul className="rankResult">
                  {resultData.map((user, index) => (
                    <li key={index}>
                      <span className="rank">{user.rank}등</span>
                      <span className="name">{user.userName}</span>
                      <span className="point">{user.point}P</span>
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
