// Swiper 핵심 및 필수 모듈 가져오기
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Swiper 스타일 가져오기
import 'swiper/css';
import 'swiper/css/navigation';

type CharacterProps = {
  id: number;
  image_link: string;
};

const Carousel = ({ character }: { character: CharacterProps[] }) => {
  return (
    <Swiper
      modules={[Navigation]}
      spaceBetween={50}
      slidesPerView={1}
      navigation
    >
      {character.map((characterItem, index) => (
        <SwiperSlide key={index}>
          <div className="characterArea">
            <img
              src={characterItem.image_link}
              alt={`캐릭터 이미지 ${index}`}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Carousel;
