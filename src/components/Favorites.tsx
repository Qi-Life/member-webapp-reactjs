import React, { useRef, useState, useEffect, useContext } from 'react';
import Slider from 'react-slick';
import { Link, useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';

import photoItem from '~/assets/img/image/frequency.png';
import { getFavorites } from '~/services/FavoritesServices';
import { FaCircleChevronLeft } from 'react-icons/fa6';
import { FaCircleChevronRight } from 'react-icons/fa6';
import { AppContext } from './context/AppProvider';

import { checkLockAlbum, checkLockByCategory, isLogined } from '~/helpers/token';
import LazyImage from './shared/Loader/LazyImage';

const Favorites = () => {
  const { setInfoItem } = useContext(AppContext);
  const navigate = useNavigate();
  const [dataFavorites, setDataFavorites] = useState([]) as any;
  const [buttonLeft, setButtonLeft] = useState(false);
  const [buttonRight, setButtonRight] = useState(false);
  const getDataFavorites = async () => {
    try {
      const resDataFavorites = await getFavorites();
      setDataFavorites(resDataFavorites?.data.favorite);
    } catch (error) {}
  };
  useEffect(() => {
    getDataFavorites();
  }, []);

  const sliderRef = useRef(Object as any);
  const settings = {
    dots: true,
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
        Favorites,
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
  const handleClickToPage = () => {
    if (isLogined()) {
      navigate('/favorites');
    }
  };

  return (
    <>
      {dataFavorites.fetch_flag === -1 || dataFavorites.rsp_msg === 'Account Not Found' ? (
        <></>
      ) : (
        <div className="mt-2">
          <div className="md:hidden block">
            <div className="flex items-center justify-between my-4 h-full ">
              <h1 className="block md:hidden text-base font-bold w-full">Favorites</h1>
              <div className="flex items-center justify-end w-full ">
                <span className="cursor-pointer mx-1 " onClick={handleClickLeft}>
                  <FaCircleChevronLeft size={28} color={`${buttonLeft ? 'black' : 'gray'}`} />
                </span>
                <span className="cursor-pointer mx-1" onClick={handleClickRight}>
                  <FaCircleChevronRight size={28} color={`${buttonRight ? 'black' : 'gray'}`} />
                </span>
              </div>
            </div>
          </div>
          <div className="md:hidden block ">
            <div className="w-full h-full">
              <Slider {...settings} ref={sliderRef} className="h-full w-full">
                {dataFavorites &&
                  Array.from(dataFavorites).map((item: any, index: number) => {
                    let isLock = item.type == 'rife' ? checkLockByCategory(1) : checkLockAlbum(item)
                    return (
                      <div key={index} className="my-2 w-1/2   px-2 lg:w-1/3  xl:w-1/4 block relative cursor-pointer ">
                        <Link
                          to={`/inner_frequencies?id=${item.id}&category=${item.categoryId}`}
                          style={{ maxHeight: '330px' }}
                          className="block overflow-hidden px-4 xs:px-[1.5rem]  mb-4  shadow-lg h-full bg-white rounded-lg cursor-pointer"
                        >
                          <div className="relative">
                            {isLock && (
                              <FaLock size={20} color="white" className="absolute bottom-[5%] right-[15%] z-10" />
                            )}
                            {item?.abimage ? (
                              // eslint-disable-next-line camelcase
                              <LazyImage
                                alt="photo"
                                className="block mt-[10%] sm:mt-[15%] h-auto w-full sm:w-4/5 rounded-md mx-auto "
                                src={`https://apiadmin.qienergy.ai/assets/uploads/mp3/${item.id}/${item.abimage}`}
                              />
                            ) : (
                              <LazyImage
                                alt="photo"
                                className="block mt-[10%] sm:mt-[15%] h-auto w-full sm:w-4/5 rounded-md mx-auto "
                                src={photoItem}
                              />
                            )}
                          </div>
                          <header className="py-[10px] min-h-[55px] h-auto ">
                            <h5 className=" text-center md:mt-[10px] mb-[5px] ">
                              <span className=" w-full no-underline hover:underline text-black font-semibold text-[17px]  block truncate">
                                {item.abtitle || item.title}
                              </span>
                            </h5>
                          </header>
                        </Link>
                      </div>
                    );
                  })}
              </Slider>
            </div>
          </div>

          <div onClick={() => handleClickToPage()} className="text-center ">
            <span className=" text-xs font-semibold cursor-pointer hover:underline duration-300 ease-in">See All</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Favorites;
