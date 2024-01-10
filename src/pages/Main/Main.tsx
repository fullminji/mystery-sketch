import question from '../../style/images/icon/question.svg';
import character from '../../style/images/visual/char.png';
import logo from '../../style/images/logo.png';
import Carousel from '../../components/Carousel';
import { useState } from 'react';

type characterProps = {
  id: number;
  image_link: string;
};

const Main = () => {
  const [isToggled, setIsToggled] = useState<boolean>(false);

  const characterList: characterProps[] = [
    { id: 1, image_link: character },
    { id: 2, image_link: character },
    { id: 3, image_link: character },
    { id: 4, image_link: character },
  ];

  return (
    <div className="page main">
      <h1>
        <img src={logo} alt="미스터리 스케치" className="title" />
      </h1>

      <div className="selectContainer">
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
        <div className="questionArea" onClick={() => setIsToggled(true)}>
          <img src={question} alt="questionIcon" className="questionIcon" />
        </div>
        <div className="slideArea">
          <div className="characterBg" />
          <Carousel character={characterList} />
        </div>
        <input type="text" placeholder="enter your name" className="userName" />
        <div className="btnArea">
          <button className="startBtn">START</button>
          <button className="createBtn">CREATE</button>
        </div>
      </div>
    </div>
  );
};

export default Main;
