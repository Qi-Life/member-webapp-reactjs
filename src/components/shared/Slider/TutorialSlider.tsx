import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Keyboard, Mousewheel, Pagination } from 'swiper/modules';

import 'swiper/css'; // core Swiper
import './swiper-custom.css'; // optional custom styling
import 'swiper/css/pagination';


const slideStyle = {
    height: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    backgroundColor: '#007aff',
    color: 'white',
};


const TutorialSlider = () => {
    return (
        <Swiper
            modules={[EffectCoverflow, Keyboard, Mousewheel, Pagination]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            keyboard={{ enabled: true }}
            mousewheel={{ thresholdDelta: 70 }}
            coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 150,
                modifier: 6,
                slideShadows: true
            }}
            breakpoints={{
                560: { slidesPerView: 2.5 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 3 }
            }}
            className="swiper-container"
            pagination={true}
        >
            {[1, 2, 3, 4, 5].map((n) => (
                <SwiperSlide key={n} >
                    <div className="slide-box">
                        Slide {n}
                    </div>
                </SwiperSlide>
            ))}

            {/* Navigation Buttons */}
            <div className="swiper-button-next" />
            <div className="swiper-button-prev" />
        </Swiper>
    );

}




export default TutorialSlider
