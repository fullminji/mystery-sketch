import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Create: React.FC = () => {
  const api = process.env.REACT_APP_PUBLIC_SERVER_URI;
  const navigate = useNavigate();
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [time, setTime] = useState(60);
  const [round, setRound] = useState(5);

  const handleCreate = () => {
    const nickName = sessionStorage.getItem('nickName');
    const profileImage = sessionStorage.getItem('character');

    fetch(`${api}/api/users/createsecret`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        nickname: nickName,
        profileImage: Number(profileImage),
        maxPlayers: maxPlayers,
        time: time,
        round: round,
      }),
    })
      .then(res => res.json())
      .then(data => {
        const roomId = data && data.roomId;
        if (roomId) {
          navigate(`/room/${roomId}`);
        } else {
          alert('오류가 발생했습니다. 다시 시도해주세요.');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
  return (
    <div className="page create">
      <div className="container">
        <div className="gameBox">
          <div className="settingBox">
            <div className="canvas">
              <div className="check">
                <p>플레이어</p>
                <select
                  className="selectBox"
                  value={maxPlayers.toString()}
                  onChange={e => setMaxPlayers(Number(e.target.value))}
                >
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                </select>
              </div>
              <div className="check">
                <p>그리는 시간</p>
                <select
                  className="selectBox"
                  value={time.toString()}
                  onChange={e => setTime(Number(e.target.value))}
                >
                  <option>60</option>
                  <option>80</option>
                  <option>100</option>
                </select>
              </div>
              <div className="check">
                <p>라운드</p>
                <select
                  className="selectBox"
                  value={round.toString()}
                  onChange={e => setRound(Number(e.target.value))}
                >
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10</option>
                </select>
              </div>
              <button onClick={handleCreate}>START</button>
            </div>
            <div className="linkCopyBtn">
              <span>링크</span>
              <span className="linkBtn">Copy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
