import React, { useEffect, useRef, useContext, useState } from 'react';

import Slider from 'react-slick';

import { FreaturedType } from '~/interface/components.interface';
import { getFeaturedAlbums } from '~/services/AlbumServices';
import { AppContext } from './context/AppProvider';
import { FaCircleChevronLeft } from 'react-icons/fa6';
import { FaCircleChevronRight } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import { checkLockAlbum, getAccessToken } from '~/helpers/token';
import LazyImage from './shared/LazyImage';

const Featured = () => {
  const { dataFeatured, setDataFeatured, setInfoItem, scrollToTop } = useContext(AppContext);

  const navigate = useNavigate();
  const [buttonLeft, setButtonLeft] = useState(false);
  const [buttonRight, setButtonRight] = useState(false);
  const linkImage = 'https://apiadmin.qienergy.ai/assets/uploads/mp3/';

  const getDataFeaturedAlbums = async () => {
    try {
      const resFeaturedAlbums = await getFeaturedAlbums();
      if (resFeaturedAlbums?.data?.featured_albums.length > 0) {
        setDataFeatured(resFeaturedAlbums?.data?.featured_albums);
      }
    } catch (error) {}
  };
  useEffect(() => {
    getDataFeaturedAlbums();
  }, []);

  const handleClickPlayItem = (item: any) => {
    setInfoItem(item);
    navigate(`/inner_frequencies?id=${item.id}&category=${item.categoryId}`);
  };

  const handleClickSeeAll = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    navigate('/featured');
  };

  const sliderRef = useRef(Object as any);
  const settings = {
    dots: false,
    infinite: true,
    arrows: false,
    cssEase: 'linear',
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 4,
        },
      },
      {
        breakpoint: 375,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 4,
        },
      },
    ],
  };
  const handleClickRight = () => {
    sliderRef?.current?.slickNext();
    setButtonRight(true);
    setButtonLeft(false);
  };
  const handleClickLeft = () => {
    sliderRef?.current?.slickPrev();
    setButtonRight(false);
    setButtonLeft(true);
  };

  return (
    <div className="mt-2">
      <div className="md:hidden flex items-center my-4">
        <h1 className="block md:hidden text-base font-bold w-full">Featured</h1>
        <div className="flex items-center justify-end w-full ">
          <span className="cursor-pointer mx-1 " onClick={handleClickLeft}>
            <FaCircleChevronLeft size={28} color={`${buttonLeft ? 'black' : 'gray'}`} />
          </span>
          <span className="cursor-pointer mx-1" onClick={handleClickRight}>
            <FaCircleChevronRight size={28} color={`${buttonRight ? 'black' : 'gray'}`} />
          </span>
        </div>
      </div>
      <div className="md:hidden block">
        <div className="w-full h-full">
          <Slider {...settings} ref={sliderRef} className="h-full">
            {dataFeatured &&
              dataFeatured.map((item: FreaturedType, index: number) => {
                return (
                  <div key={index} className="my-2 w-1/2   px-2 lg:w-1/3  xl:w-1/4 block relative cursor-pointer  ">
                    <article
                      style={{ maxHeight: '330px' }}
                      onClick={() => handleClickPlayItem(item)}
                      className="overflow-hidden px-4 xs:px-[1.5rem]  mb-[15px]  shadow-lg h-full bg-white rounded-lg cursor-pointer"
                    >
                      <div className="relative">
                        {checkLockAlbum(item) && (
                          <FaLock size={20} color="white" className="absolute bottom-[5%] right-[15%] z-10" />
                        )}
                        <LazyImage
                          alt="photo"
                          className="block mt-[10%] sm:mt-[15%] h-auto w-full sm:w-4/5 rounded-md mx-auto "
                          src={`${linkImage}/${item.id}/${item.image}`}
                        />
                      </div>
                      <header className="py-[10px] min-h-[55px] h-auto ">
                        <h5 className=" text-center  ">
                          <span className="w-full no-underline hover:underline  text-black font-semibold text-[17px]  block truncate  ">
                            {item?.title}
                          </span>
                        </h5>
                      </header>
                    </article>
                  </div>
                );
              })}
          </Slider>
        </div>
      </div>
      <div className="text-center  cursor-pointer" onClick={() => handleClickSeeAll()}>
        <span className="font-semibold text-xs hover:underline duration-300 ease-linear">See all</span>
      </div>
    </div>
  );
};

export default Featured;
