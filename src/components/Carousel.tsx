import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';

type CharacterProps = {
  id: number;
  image_link: string;
};

const Carousel = ({
  character,
  setCurrentIndex,
}: {
  character: CharacterProps[];
  setCurrentIndex: (index: number) => void;
}) => {
  const handleSlideChange = (swiper: any) => {
    setCurrentIndex(swiper.realIndex);
  };

  return (
    <Swiper
      modules={[Navigation]}
      spaceBetween={50}
      slidesPerView={1}
      navigation
      onSlideChange={handleSlideChange}
    >
      {character.map((characterItem, index) => (
        <SwiperSlide key={characterItem.id}>
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
