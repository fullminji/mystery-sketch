import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from './Carousel';
import question from '../style/images/icon/question.svg';
import logo from '../style/images/logo.png';
import Sound from './Sound';

type characterProps = {
  id: number;
  image_link: string;
};

const Name = () => {
  const api = process.env.REACT_APP_PUBLIC_SERVER_URI;
  const [isToggled, setIsToggled] = useState<boolean>(false);
  const [character, setCharacter] = useState<characterProps[]>([]);
  const [name, setName] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const selectRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${api}/api/profileimage`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    })
      .then(res => res.json())
      .then(data => {
        setCharacter(data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

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

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nickName = e.target.value;
    if (nickName.length <= 10) {
      setName(nickName);
    }
  };

  const handleStart = () => {
    const isValidName = /^[a-zA-Z0-9가-힣ㄱ-ㅎ]{1,10}$/.test(name);

    if (name.length === 0) {
      return alert('이름을 입력해주세요.');
    } else if (name.length > 10) {
      return alert('10글자 이하로 입력해주세요.');
    } else if (!isValidName) {
      return alert('특수문자, 공백을 제외한 닉네임을 입력해주세요.');
    }
    fetch(`${api}/api/users/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        nickname: name,
        profileImage: currentIndex + 1,
      }),
    })
      .then(res => res.json())
      .then(data => {
        const roomId = data && data.roomId;
        if (roomId) {
          sessionStorage.setItem('nickName', name);
          sessionStorage.setItem('character', (currentIndex + 1).toString());
          navigate(`/room/${roomId}`);
        } else if (data.message === 'NICKNAME_DOUBLE_CHECKED_ERROR') {
          alert('중복 닉네임입니다.');
        } else {
          alert('오류가 발생했습니다. 다시 시도해주세요.');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleCreate = () => {
    const isValidName = /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]{1,10}$/.test(name);

    if (name.length === 0) {
      return alert('이름을 입력해주세요.');
    } else if (name.length > 10) {
      return alert('10글자 이하로 입력해주세요.');
    } else if (!isValidName) {
      return alert('특수문자, 공백을 제외한 닉네임을 입력해주세요.');
    }
    sessionStorage.setItem('nickName', name);
    sessionStorage.setItem('character', (currentIndex + 1).toString());

    navigate('/create');
  };
  return (
    <div className="page main">
      <h1>
        <img src={logo} alt="미스터리 스케치" className="title" />
      </h1>
      <div className="selectContainer" ref={selectRef}>
        {isToggled && (
          <div className="howToPlayArea" onClick={() => setIsToggled(false)}>
            <div className="playContainer">
              <h2>How to Play</h2>
              <h3>MYSTERY SKETCH에 오신 걸 환영합니다!</h3>
              <div className="explanation">
                <ul>
                  <li>
                    각 라운드마다 플레이어들은 무작위로 할당된 단어를 그려 다른
                    플레이어들이 추측할 수 있도록 합니다.
                  </li>
                  <li>
                    플레이어는 채팅을 통해 정답을 맞추면 해당 라운드가 종료되며
                    다음 라운드가 진행됩니다.
                  </li>
                </ul>
                <p>
                  가장 많은 점수를 얻어 1등에 도전하세요!
                  <br />
                  게임을 즐기면서 즐거운 시간 보내세요!
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="questionArea">
          <img
            src={question}
            alt="questionIcon"
            className="questionIcon"
            onClick={() => setIsToggled(true)}
          />
          <div className="soundArea">
            <Sound />
          </div>
        </div>
        <div className="slideArea">
          <div className="characterBg" />
          <Carousel
            character={character}
            setCurrentIndex={(index: number) => setCurrentIndex(index)}
          />
        </div>
        <input
          type="text"
          placeholder="enter your name"
          className="userName"
          value={name}
          onChange={e => handleName(e)}
        />
        <div className="btnArea">
          <button className="startBtn" onClick={handleStart}>
            START
          </button>
          <button className="createBtn" onClick={handleCreate}>
            CREATE
          </button>
        </div>
      </div>
    </div>
  );
};

export default Name;
