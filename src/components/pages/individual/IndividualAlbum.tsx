import React, { useState, useEffect, useContext } from 'react';
import SearchIcon from '~/components/shared/Icons/SearchIcon';

import photoItem from '~/assets/img/image/frequency.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LoadingButton from '~/components/LoadingButton';
import Advertisement from '~/components/Advertisement';

import { AuthContext } from '~/components/context/AppProvider';
import ScrollToTop from '~/components/ScrollToTop';
import { getFreeAlbums, getIndividualAlbum } from '~/services/AlbumServices';
import SideBarMenuModal from '~/components/shared/SidebarMenu/SideBarMenuModal';
import FilterIcon from '~/components/shared/Icons/FilterIcon';

const IndividuaAlbum = () => {
  const navigate = useNavigate();
  const { statusScrollTop, setStatusScrollTop, setPathName, setShowModal } = useContext(AuthContext);

  const { search, pathname } = useLocation();
  const [invidualAlbums, setIndividualAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIndividualAlbums = async () => {
    setPathName(pathname);
    try {
      const individualAlbumsRes = await getIndividualAlbum();
      const data = individualAlbumsRes.data.map((item: any) => ({
        ...item,
      })).filter((item:any) => item.categoryId != 7);
      setIndividualAlbums(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchIndividualAlbums();
  }, []);

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
    window.addEventListener('scroll', handleScroll);
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
    } else {
      const res = await getFreeAlbums(search);
    }
  };

  return (
    <>
      <div>
        <div className="hidden md:block">
          <div className="flex justify-between px-4">
            <h1 className="text-xl font-medium">Individual Albums</h1>
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
      </div>
      <button
        type="button"
        className="bg-[#409F83] h-10 w-full flex items-center relative rounded-md sm:hidden"
        onClick={() => setShowModal(true)}
      >
        <span className="ml-2">
          <FilterIcon />
        </span>
        <span className="text-white absolute left-1/2 -translate-x-1/2">Filter</span>
      </button>
      {loading ? (
        <>
          <LoadingButton />
        </>
      ) : (
        <>
          <div className="flex flex-wrap w-full mx-auto  md:justify-start mt-4 ">
            {Array.from(invidualAlbums).length === 0 ? (
              <p className="text-center text-base mt-10">You Don&apos;t Have Any Invidual Albums</p>
            ) : (
              <></>
            )}
            {invidualAlbums &&
              Array.from(invidualAlbums).map((item: any, index: number) => {
                return (
                  <div key={index} className=" p-2 w-1/2 md:px-2.5 lg:my-1.5  lg:w-1/3 xl:w-1/4 block cursor-pointer ">
                    <Link
                      to={`/inner_frequencies?id=${item.id}&category=${item.categoryId}`}
                      className="block overflow-hidden px-4 xs:px-[1.5rem]  mb-4  shadow-lg h-full bg-white rounded-lg cursor-pointer"
                    >
                      <div className="relative mt-[10%] sm:mt-[15%] h-auto w-full sm:w-4/5 rounded-md mx-auto">
                        {item?.image ? (
                          <img
                            alt="photo"
                            className="block"
                            src={`https://apiadmin.qienergy.ai/assets/uploads/mp3/${item.id}/${item.image}`}
                          />
                        ) : (
                          <img alt="photo" className="block" src={photoItem} />
                        )}
                      </div>
                      <header className="py-[10px] ">
                        <h1 className="text-center md:mt-[10px] ">
                          <span className="no-underline hover:underline text-black font-semibold text-[17px]  block truncate ">
                            {item.title}
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
      <SideBarMenuModal />
      {statusScrollTop && (
        <div onClick={() => handleClickToTop()} className="fixed bottom-5 right-5">
          <ScrollToTop />
        </div>
      )}
    </>
  );
};

export default IndividuaAlbum;
