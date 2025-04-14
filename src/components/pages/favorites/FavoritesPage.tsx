import React, { useState, useEffect, useContext } from 'react';
import SearchIcon from '~/components/shared/Icons/SearchIcon';
import SortIcon from '~/components/shared/Icons/SortIcon';
import { getFavorites } from '~/services/FavoritesServices';

import photoItem from '~/assets/img/image/frequency.png';
import playlistImage from '~/assets/img/custom_playlist.jpeg';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import LoadingButton from '~/components/LoadingButton';
import { checkLockAlbum, checkLockByCategory } from '~/helpers/token';
import { FaLock } from 'react-icons/fa';
import Advertisement from '~/components/Advertisement';
import { FaAngleLeft } from 'react-icons/fa6';
import { AuthContext } from '~/components/context/AppProvider';
import ScrollToTop from '~/components/ScrollToTop';
import { getFreeAlbums } from '~/services/AlbumServices';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { statusScrollTop, setStatusScrollTop, setPathName } = useContext(AuthContext);
  const { search, pathname } = useLocation();
  const [dataFavorites, setDataFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusRecent, setStatusRecent] = useState(false);
  const [sortName, setSortName] = useState('Recent');

  const queryParams = new URLSearchParams(location.search);
  let limit = String(new URLSearchParams(search).get('limit') ?? '10');
  const page = Number.isNaN(parseInt(queryParams.get('page'), 10)) ? 1 : parseInt(queryParams.get('page'), 10);

  const getDataFavorites = async () => {
    setPathName(pathname);
    try {
      const resFavorites = await getFavorites();
      if (
        resFavorites &&
        resFavorites.data.favorite.fetch_flag === -1 &&
        resFavorites.data.favorite.rsp_msg === 'Account Not Found'
      ) {
        localStorage.clear();
        navigate('/login');
      }
      const favoriteAlbums = resFavorites.data.favorite.map((item: any) => ({
        ...item,
        locked: !checkLockAlbum(item.id),
      }));
      setDataFavorites(favoriteAlbums);
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
    getDataFavorites();
  }, []);

  const handleClickToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  const handleClickPlayItem = (item: any) => {
    navigate(`/inner_frequencies?id=${item.id}&category=${item.categoryId}`);
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
    if (e.key === 'Enter' && e.target.value.trim() != '') {
      navigate(`/search?keyword=${e.target.value}`);
    }
  };
  const handleEnterSearch = async (search: any) => {
    if (search === ' ') {
    } else {
      const res = await getFreeAlbums(search);
    }
  };

  const getTitleItem = (item: any) => {
    if (item.type == 'rife') {
      return item.title
    } else if (item.type == 'album') {
      return item.abtitle
    } else {
      return item.playlistName
    }
  }

  const getItemImage = (item: any) => {
    if (item.type == 'rife') {
      return <img alt="photo" className="block" src={photoItem} />
    } else if (item.type == 'album') {
      return <img
        alt="photo"
        className="block"
        src={`https://apiadmin.qienergy.ai/assets/uploads/mp3/${item.id}/${item.abimage}`}
      />
    } else {
      return <img alt="photo" className="block" src={playlistImage} />
    }
  }

  const getItemUrl = (item: any) => {
    if(item.type == 'playlist'){
      return `/playlists?id=${item.id}`
    }else{
      return `/inner_frequencies?id=${item.id}&category=${item.categoryId}`
    }
  }

  return (
    <>
      <div>
        <div className="hidden md:block">
          <div className="flex justify-between px-4">
            <h1 className="text-xl font-medium">Favorites</h1>
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
      <h1 className="text-xl text-center font-medium block md:hidden">Favorites</h1>
      {loading ? (
        <>
          <LoadingButton />
        </>
      ) : (
        <>
          <div className="flex flex-wrap w-full mx-auto  md:justify-start mt-4 ">
            {Array.from(dataFavorites).length === 0 ? (
              <p className="text-center text-base mt-10">You Don&apos;t Have Any Favorites Frequencies</p>
            ) : (
              <></>
            )}
            {dataFavorites &&
              Array.from(dataFavorites).map((item: any, index: number) => {
                return (
                  <div key={index} className=" p-2 w-1/2 md:px-2.5 lg:my-1.5  lg:w-1/3 xl:w-1/4 block cursor-pointer ">
                    <Link
                      to={getItemUrl(item)}
                      className="block overflow-hidden px-4 xs:px-[1.5rem]  mb-4  shadow-lg h-full bg-white rounded-lg cursor-pointer"
                    >
                      <div className="relative mt-[10%] sm:mt-[15%] h-auto w-full sm:w-4/5 rounded-md mx-auto">
                        {getItemImage(item)}
                        {(checkLockAlbum(item) && checkLockByCategory(item.categoryId) && item.type != 'playlist') && (
                          <FaLock size={20} color="white" className="absolute bottom-[5%]  right-[5%] z-10" />
                        )}
                      </div>
                      <header className="py-[10px] ">
                        <h1 className="text-center md:mt-[10px] ">
                          <span className="no-underline hover:underline text-black font-semibold text-[17px]  block truncate ">
                            {getTitleItem(item)}
                          </span>
                        </h1>
                      </header>
                    </Link>
                  </div>
                );
              })}
            {/* {dataFavorites && (
              <div className="w-full text-center ">
                <ReactPaginate
                  previousLabel="<"
                  nextLabel=">"
                  breakLabel={'...'}
                  pageCount={totalPage}
                  marginPagesDisplayed={marginPages}
                  pageRangeDisplayed={pageRange}
                  onPageChange={handlePageClick}
                  containerClassName="flex items-center w-full justify-end "
                  pageClassName="border  mx-1 text-clgreen "
                  pageLinkClassName="font-semibold inline-block h-9 min-w-[30px]  flex justify-center items-center"
                  nextClassName="border round-sm text-clgreen font-semibold "
                  nextLinkClassName="h-9 min-w-[30px] w-auto inline-block flex items-center justify-center hover:opcity-90 ducation-200"
                  previousClassName="border  text-clgreen font-semibold "
                  previousLinkClassName="h-9 min-w-[30px] w-auto inline-block flex items-center justify-center hover:opcity-90 ducation-200"
                  breakClassName="text-clgreen"
                  activeClassName="border-2 border-clgreen"
                  // forcePage={page - 1}
                />
              </div>
            )} */}
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

export default FavoritesPage;
