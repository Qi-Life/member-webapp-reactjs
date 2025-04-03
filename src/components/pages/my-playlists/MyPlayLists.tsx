import React, { useCallback, useContext, useEffect, useState } from 'react';

import { AuthContext } from '~/components/context/AppProvider';
import SearchIcon from '~/components/shared/Icons/SearchIcon';
import AddIcon from '~/assets/img/img_card_plus.png';
import bannerFooter from '~/assets/img/qc-max-admob-horizontal.jpg';
import photoItem from '~/assets/img/custom_playlist.jpeg';
import FilterIcon from '~/components/shared/Icons/FilterIcon';
import { deletePlayList, getPlayList } from '~/services/PlaylistServices';
import SideBarMenuModal from '../../shared/SidebarMenu/SideBarMenuModal';
import _ from 'lodash';
import { debounce } from 'lodash';
import { useSearchParams, useNavigate, Link, useLocation } from 'react-router-dom';

import ScrollToTop from '~/components/ScrollToTop';
import { toast } from 'react-toastify';

const MyPlaylists = () => {
  const {
    handleClickAddNewPlaylist,
    dataMyPlaylist,
    setDataMyPlaylist,
    userID,
    statusScrollTop,
    setStatusScrollTop,
    setShowModal,
    getMyPlaylist,
    setPathName,
  } = useContext(AuthContext);
  const navigate = useNavigate();
  const { search, pathname } = useLocation();
  const keyword = String(new URLSearchParams(search).get('keyword') ?? '');

  const [searchParams, setSearchParams] = useSearchParams();
  const [statusChildMenu, setStatusChildMenu] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const debouncedUpdate = useCallback(
    debounce((value) => {
      handleEnterSearch(value);
      if (value === '') {
        setSearchParams('');
      } else {
        setSearchParams({ ...searchParams, keyword: value });
      }
      setStatusChildMenu(false);
    }, 1000),
    []
  );

  const handleChange = (e: any) => {
    setSearchInput(e.target.value);
    debouncedUpdate(e.target.value);
    if (e.target.value === '') {
      handleEnterSearch(e.target.value);
      setStatusChildMenu(false);
    } else {
      setStatusChildMenu(true);
    }
  };

  const handleSearch = async () => {
    setSearchParams({ keyword });
    handleEnterSearch(keyword);
  };

  const handleEnterSearch = async (search: string) => {
    if (search === ' ') {
      const res = await getPlayList(userID);
      setDataMyPlaylist(res.data?.playlist);
    } else {
      const res = await getPlayList(userID, search);
      if (res.data.playlist?.fetch_flag === -1) {
        setDataMyPlaylist([]);
      } else {
        setDataMyPlaylist(res.data?.playlist);
      }
    }
  };

  const handleClickSearchInput = (item: any) => {
    console.log('item.name', item.name);
    handleEnterSearch(item.name);
    if (item.title === '') {
      setSearchParams('');
    } else {
      setSearchParams({ keyword: item.name });
    }
    setStatusChildMenu(false);
  };

  const handleDeletePlaylist = async (id: string) => {
    try {
      if (confirm('Do you want to delete this playlists ?') === true) {
        const resDel = await deletePlayList(id);
        try {
          navigate('/playlists_list');
          toast.success(resDel.data.rsp_msg);
        } catch (error) {
          navigate('/playlists_list');
          toast.error(resDel.data.rsp_msg);
        }
        const res = await getPlayList(userID);
        setDataMyPlaylist(res.data?.playlist);
      }
    } catch (error) { }
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
  useEffect(() => {
    getMyPlaylist(keyword);
    setPathName(pathname);
  }, [keyword]);

  return (
    <>
      <>
        <div className="w-full mb-5 md:flex justify-between hidden h-[27px] px-4">
          <h3 className=" font-medium w-1/2 text-base lg:text-xl text-black pl-4  ">My Playlists</h3>
          <div className="flex w-1/3 items-center bg-white rounded-md pl-2 h-[34px] border relative">
            <SearchIcon w="16" h="16" />
            <input
              type="text"
              onChange={(e) => handleChange(e)}
              onKeyDown={handleSearch}
              className="w-full h-full outline-none border-none text-sm rounded-md block px-2.5 placeholder:text-black placeholder:font-medium"
              placeholder="Search..."
              value={searchInput || keyword}
            />
          </div>
        </div>
        <div className="md:hidden block ">
          <div className="border border-[#9F9F9F] h-[34px] rounded-md w-full flex items-center relative my-4">
            <span className="ml-2">
              <SearchIcon w="28" h="28" />
            </span>
            <input
              type="text"
              className="font-light pl-2 w-full h-full bg-transparent border-none outline-none px-2 placeholder:text-[14px] placeholder:absolute placeholder:left-1/2 placeholder:-translate-x-1/2"
              placeholder="Search"
              onChange={(e) => handleChange(e)}
              onKeyDown={handleSearch}
              value={searchInput || keyword}
            />
            <button
              type="submit"
              className="bg-[#409F83] text-white px-4 h-full rounded-md ml-2 hover:bg-[#367A61] focus:outline-none md:hidden"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
          <button
            type="button"
            className="bg-[#409F83] h-[34px] w-full flex items-center relative rounded-md"
            onClick={() => setShowModal(true)}
          >
            <span className="ml-2">
              <FilterIcon />
            </span>
            <span className="text-white absolute left-1/2 -translate-x-1/2">Filter</span>
          </button>
          <h3 className=" font-medium w-full sm:w-1/2 text-lg lg:text-xl  pl-2 mt-4 ">My Playlists</h3>
        </div>

        <div className="flex flex-wrap  gap-2">
          <div className="flex flex-wrap w-full mx-auto  md:justify-start mt-4 ">
            <div className="   my-1.5 px-2  w-1/2    md:px-2 lg:my-4  lg:w-1/3  xl:w-1/4 block cursor-pointer  ">
              <div
                onClick={handleClickAddNewPlaylist}
                className="overflow-hidden  shadow-lg rounded-lg h-full min-h-[150px]  bg-white flex flex-col items-center justify-center"
              >
                <img className="block h-auto  w-1/2 max-w-[50px] cursor-pointer" src={AddIcon} alt="plus" />
                <p className="text-center font-semibold text-black ">Add</p>
              </div>
            </div>

            {Array.isArray(dataMyPlaylist) &&
              dataMyPlaylist.map((item: any, index: number) => (
                <div
                  key={index}
                  className="my-1.5 w-1/2    px-2 lg:my-4  lg:w-1/3 xl:w-1/4 block cursor-pointer relative"
                >
                  <Link
                    to={`/playlists?id=${item.id}`}
                    className="block overflow-hidden px-4 xs:px-[1.5rem] mb-4 shadow-lg rounded-lg h-full bg-white"
                  >
                    {!item?.image ? (
                      // eslint-disable-next-line camelcase
                      <img
                        alt="photo"
                        className="block mt-[10%] h-auto w-full sm:w-4/5 rounded-md mx-auto"
                        src={photoItem}
                      />
                    ) : (
                      <img
                        alt="photo"
                        className="block mt-[10%] h-auto w-full sm:w-4/5 rounded-md mx-auto "
                        src={item.image}
                      />
                    )}
                    {item.private == 1 && (
                      <svg
                        className="h-5 w-5 text-white absolute sm:right-10 right-5 bottom-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {' '}
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /> <circle cx="12" cy="7" r="4" />
                      </svg>
                    )}

                    <header className="p-2 h-auto text-center ">
                      <span className="no-underline hover:underline w-full text-black font-semibold text-[17px]  block truncate  ">
                        {item?.name ? item.name : 'No name'}
                      </span>

                      <p className="text-center block truncate text-black">{item.description}</p>
                    </header>
                  </Link>
                  <svg
                    onClick={() => handleDeletePlaylist(item.id)}
                    className="z-20  h-8 w-8 p-1 text-red-500 absolute top-[4%] right-[14%] xs:top-[6%]  sm:top-[8%] sm:right-[16%] md:right-[21%] lg:right-[17%] cursor-pointer hover:opacity-90"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {' '}
                    <path stroke="none" d="M0 0h24v24H0z" /> <line x1="18" y1="6" x2="6" y2="18" />{' '}
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
              ))}
          </div>
        </div>

        <div className="mt-4">
          <img className="rounded-md" src={bannerFooter} alt="" />
        </div>

        <SideBarMenuModal />
        {statusScrollTop && (
          <div onClick={() => handleClickToTop()} className="fixed bottom-5 right-5">
            <ScrollToTop />
          </div>
        )}
      </>
    </>
  );
};
export default MyPlaylists;
