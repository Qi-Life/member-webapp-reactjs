import React, { useState, useEffect, useContext } from 'react';
import SearchIcon from '~/components/shared/Icons/SearchIcon';
import SortIcon from '~/components/shared/Icons/SortIcon';
import { Link, useNavigate } from 'react-router-dom';
import LoadingButton from '~/components/LoadingButton';
import { checkLockAlbum } from '~/helpers/token';
import { FaLock } from 'react-icons/fa';
import { getFeaturedAlbums, getFreeAlbums } from '~/services/AlbumServices';
import { AppContext } from '~/components/context/AppProvider';
import Advertisement from '~/components/Advertisement';
import { FaAngleLeft } from 'react-icons/fa6';
import ScrollToTop from '~/components/ScrollToTop';

const FeaturedPage = () => {
  const { dataFeatured, setDataFeatured, statusScrollTop, setStatusScrollTop } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const linkImage = 'https://apiadmin.qienergy.ai/assets/uploads/mp3/';
  const [sortName, setSortName] = useState('Recent');
  const [statusRecent, setStatusRecent] = useState(false);
  const getDataFeaturedAlbums = async () => {
    try {
      const resFeaturedAlbums = await getFeaturedAlbums();
      if (resFeaturedAlbums?.data?.featured_albums.length > 0) {
        setDataFeatured(resFeaturedAlbums?.data?.featured_albums);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const handleClickSort = (name: string) => {
    setSortName(name);
    setStatusRecent(false);
  };

  useEffect(() => {
    getDataFeaturedAlbums();
  }, []);

  const handleClickPlayItem = (item: any) => {
    navigate(`/inner_frequencies?id=${item.id}&category=${item.categoryId}`);
  };

  const handleClickToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.scrollY;
      if (currentPosition >= 200) {
        setStatusScrollTop(true);
      } else {
        setStatusScrollTop(false);
      }
    };

    // Add event listener when component mounts
    window.addEventListener('scroll', handleScroll);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const handleChange = (e: any) => {
    if (e.target.value.trim() === '') {
      handleEnterSearch(e.target.value.trim());
    } else {
    }
  };

  const handleSearch = async (e: any) => {
    if ((e.key === 'Enter' || e.code === 'Enter') && e.currentTarget.value.trim() !== '') {
      navigate(`/search?keyword=${e.target.value}`);
    }
  };
  const handleEnterSearch = async (search: any) => {
    if (search === ' ') {
      // const res = await getFreeAlbums();
      // setDataFreeFrequencies(res.data.free_albums);
    } else {
      const res = await getFreeAlbums(search);
    }
  };

  return (
    <>
      <div>
        <div className="hidden md:block">
          <div className="flex justify-between px-2">
            <h1 className="text-xl font-medium">Featured</h1>
            <div className="flex w-1/3 border items-center bg-white rounded-md pl-2 h-[34px]">
              <SearchIcon w="16" h="16" />
              <input
                type="text"
                className="w-full h-full outline-none border-none text-sm rounded-md block px-2.5"
                placeholder="Search..."
                onChange={(e) => handleChange(e)}
                onKeyDown={handleSearch}
              />
            </div>
          </div>
        </div>
        <div className="md:hidden block">
          <div className="flex items-center">
            <div
              onClick={() => navigate(-1)}
              className="w-10 mr-2 h-[34px] border border-clgreen  cursor-pointer rounded-md flex items-center justify-center shadow-md"
            >
              <FaAngleLeft size={20} color="#409F83" />
            </div>

            <div className="border border-[#9F9F9F] h-[34px] rounded-md  mx-auto flex items-center relative my-4 w-full">
              <span className="ml-2">
                <SearchIcon w="24" h="24" />
              </span>
              <input
                type="text"
                className="text-[14px] font-light  w-full  bg-transparent border-none outline-none placeholder:text-center placeholder:w-4/5 px-2"
                placeholder="Search"
                onChange={(e) => handleChange(e)}
                onKeyDown={handleSearch}
              />
            </div>
          </div>
          <div className="border border-[#9F9F9F] bg-white h-9 rounded-md  mx-auto flex items-center relative my-2">
            <div className="w-full outline-none" onClick={() => setStatusRecent(!statusRecent)}>
              <button className="w-full font-medium">{sortName}</button>
              <span className="ml-2 flex items-center px-3 h-full absolute top-0 right-0 rounded-md cursor-pointer hover:opacity-90 shadow-md bg-[#409F83]">
                <SortIcon w="20" h="20" />
              </span>
              <ul
                className={`${statusRecent ? 'translate-y-0 visible ' : 'invisible -translate-y-1/2 opacity-0 '
                  } duration-200 ease-in absolute top-9 bg-white left-0 right-0 shadow-lg rounded-md border border-clgreen z-10 text-center overflow-hidden`}
              >
                <li
                  onClick={() => handleClickSort('Recent')}
                  className="p-2 hover:bg-[#ECF5F4] cursor-default duration-200 ease-linear"
                >
                  Recent
                </li>
                <li
                  onClick={() => handleClickSort('Favorites')}
                  className="p-2 hover:bg-[#ECF5F4] cursor-default duration-200 ease-linear"
                >
                  Favorites
                </li>
                <li
                  onClick={() => handleClickSort('Recommented')}
                  className="p-2 hover:bg-[#ECF5F4] cursor-default duration-200 ease-linear"
                >
                  Recommented
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <h1 className="text-xl font-medium block md:hidden text-center my-4">Featured</h1>
      {loading ? (
        <>
          <LoadingButton />
        </>
      ) : (
        <>
          <div className="flex flex-wrap flex-1  ">
            {Array.from(dataFeatured).length === 0 ? (
              <p className="text-center text-base mt-10">You Don&apos;t Have Any Favorites Frequencies</p>
            ) : (
              <></>
            )}
            {dataFeatured &&
              Array.from(dataFeatured).map((item: any, index: number) => {
                return (
                  <div
                    key={index}
                    className=" relative p-2 w-1/2 md:px-2.5 lg:my-1.5  lg:w-1/3 xl:w-1/4 block cursor-pointer "
                  >
                    <Link
                      to={`/inner_frequencies?id=${item.id}&category=${item.categoryId}`}
                      className="block overflow-hidden px-4 xs:px-[1.5rem]  mb-4  shadow-lg h-full bg-white rounded-lg cursor-pointer"
                    >
                      <div className='relative  mt-[10%] sm:mt-[15%] h-auto w-full sm:w-4/5 rounded-md mx-auto'>
                        <img
                          alt="photo"
                          className="block"
                          src={`${linkImage}/${item.id}/${item.image}`}
                        />
                        {checkLockAlbum(item) && (
                          <FaLock
                            size={20}
                            color="white"
                            className="absolute right-[5%] bottom-[5%] sm:right-[5%] z-10"
                          />
                        )}
                      </div>
                      <header className="py-[10px] ">
                        <h1 className="text-center  ">
                          <span className="no-underline hover:underline text-black font-semibold text-[17px]  block truncate cursor-default ">
                            {item?.title}
                          </span>
                        </h1>
                      </header>
                    </Link>

                  </div>
                );
              })}
          </div>
        </>
      )}
      <div className="my-4 md:hidden block">
        <Advertisement />
      </div>
      {statusScrollTop && (
        <div onClick={() => handleClickToTop()} className="fixed bottom-5 right-5">
          <ScrollToTop />
        </div>
      )}
    </>
  );
};

export default FeaturedPage;
