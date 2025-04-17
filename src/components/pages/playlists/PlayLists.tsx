import React, { useState, useEffect, useCallback, useContext } from 'react';

import SearchIcon from '../../shared/Icons/SearchIcon';
import photoItem from '~/assets/img/custom_playlist.jpeg';
import { getMostPlaylist, votePlayList } from '~/services/PlaylistServices';
import FilterIcon from '~/components/shared/Icons/FilterIcon';
import { debounce } from 'lodash';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import LoadingButton from '~/components/LoadingButton';
import SideBarMenuModal from '~/components/shared/SidebarMenu/SideBarMenuModal';
import { isLogined } from '~/helpers/token';
import ReactPaginate from 'react-paginate';
import { AppContext } from '~/components/context/AppProvider';
import ScrollToTop from '~/components/ScrollToTop';
import LazyImage from '~/components/shared/LazyImage';
import { saveFavorite } from '~/services/FavoritesServices';

const PlayLists = () => {
  const navigate = useNavigate();
  const search = useLocation().search;
  const { statusScrollTop, setStatusScrollTop, setShowModal } = useContext(AppContext);
  const [dataPlaylist, setDataPlaylist] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, perPage: 20, total: 0 });
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const [statusChildMenu, setStatusChildMenu] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  // responsive paginate
  const [pageRange, setPageRange] = useState(5); // Set the initial value
  const [marginPages, setMarginPages] = useState(5);
  const keyword = String(new URLSearchParams(search).get('keyword') ?? '');

  const debouncedUpdate = useCallback(
    debounce((value) => {
      handleEnterSearch(value);
      if (value === '') {
        setSearchParams('');
      } else {
        setSearchParams({ keyword: value });
      }
      setStatusChildMenu(false);
    }, 1000),
    []
  );

  const handleChange = (e: any) => {
    debouncedUpdate(e.target.value);
    if (e.target.value === '') {
      setSearchParams('');
      setStatusChildMenu(false);
    } else {
      setStatusChildMenu(true);
    }
    setSearchInput(e.target.value);
  };

  const getPlaylists = async (
    { search, page, perPage }: any = {
      page: pagination.page,
      perPage: pagination.perPage,
      search: searchInput || keyword,
    }
  ) => {
    try {
      const resPlaylist = await getMostPlaylist(search, page, perPage);
      const userId = localStorage.getItem('id_user');

      const newData = resPlaylist?.data?.playlist.map((item: any) => {
        return {
          ...item,
          isVoted: !!item.vote_ids?.split(',').find((_voteItem: any) => _voteItem == userId),
        };
      });
      setDataPlaylist(newData);
      setPagination({
        page: resPlaylist?.data.page,
        perPage: resPlaylist?.data.perPage,
        total: resPlaylist?.data.total,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleEnterSearch = async (search: any) => {
    setLoading(true)
    await getPlaylists({ search });
    setLoading(false)
  };

  const handleItemsPerPageChange = (e: any) => {
    getPlaylists({ page: 1, perPage: e.target.value, search: searchInput });
  };

  const handlePageClick = (data: any) => {
    const currentPage = data?.selected;

    getPlaylists({ search: searchInput, page: currentPage + 1, perPage: pagination.perPage });
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleSearch = async (e: any) => {
    if (e.key == 'Enter') {
      setSearchParams({ keyword });
      handleEnterSearch(keyword);
    }
  };

  // click to play music
  const handleClickPlayItem = (item: any) => {
    if (!item.lock) {
      navigate(`/popular_playlists?id=${item.id}`);
    } else {
      alert('This playlist contains albums you are not accessible');
    }
  };

  useEffect(() => {
    getPlaylists();
  }, [location]);

  const handleVote = async (e: any, item: any) => {
    e.stopPropagation()
    if (!isLogined()) {
      return navigate('/login');
    }
    const data = {
      playlist_id: item.id,
      vote: +!item.isVoted,
    };
    await votePlayList(data);
    const newData = dataPlaylist.map((_item) => {
      const stepCount = !item.isVoted == true ? 1 : -1;
      if (_item.id == item.id) {
        return { ..._item, isVoted: !_item.isVoted, vote_count: +_item.vote_count + stepCount };
      }
      return { ..._item };
    });
    setDataPlaylist(newData);
  };

  useEffect(() => {
    const handleResize = () => {
      // Adjust pageRange and marginPages based on the screen width
      const screenWidth = window.innerWidth;
      if (screenWidth < 640) {
        setPageRange(3); // Set a smaller value for smaller screens
        setMarginPages(2); // Adjust marginPages as needed
      } else if (screenWidth < 768) {
        setPageRange(4); // Set the default value for larger screens
        setMarginPages(4); // Adjust marginPages as needed
      } else {
        setPageRange(6); // Set the default value for larger screens
        setMarginPages(5); // Adjust marginPages as needed
      }
    };
    // Attach the event listener for window resize
    window.addEventListener('resize', handleResize);
    // Call handleResize once to set the initial values
    handleResize();
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
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

    // Add event listener when component mounts
    window.addEventListener('scroll', handleScroll);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleFavorite = async (e: any, item: any) => {
    if (!isLogined()) {
      return navigate('/login');
    }
    e.stopPropagation()
    let is_favorite = item.is_favorite == 1 ? 0 : 1;
    const postData = {
      playlist_id: item.id,
      is_favorite: is_favorite
    }
    saveFavorite(postData).then(() => {
      const newData = dataPlaylist.map((_item) => {
        if (_item.id == item.id) {
          return { ..._item, is_favorite: is_favorite };
        }
        return { ..._item };
      });
      setDataPlaylist(newData);
    })
  }

  return (
    <>
      <div className="w-full  mb-5 md:flex hidden justify-between h-[27px] px-2 ">
        <h3 className=" font-medium w-1/2 text-base lg:text-xl    ">Public Playlists</h3>
        <div className="flex xl:w-1/4 lg:w-1/3 items-center bg-white rounded-md pl-2 h-[34px] border relative z-10">
          <SearchIcon w="16" h="16" />
          <input
            type="text"
            onChange={(e) => handleChange(e)}
            onKeyDown={handleSearch}
            className="w-full h-full outline-none  border-none text-sm rounded-md block px-2.5 placeholder:font-medium placeholder:text-black"
            placeholder="Search..."
            value={searchInput || keyword}
          />
        </div>
      </div>
      <div className="md:hidden block ">
        <form className="border border-[#9F9F9F] h-[34px] rounded-md w-full flex items-center relative my-4">
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
            type="button"
            className="bg-[#409F83] text-white px-4 h-full rounded-md ml-2 hover:bg-[#367A61] focus:outline-none md:hidden"
            onClick={handleSearch}
          >
            Search
          </button>
        </form>

        <button
          onClick={() => setShowModal(true)}
          type="button"
          className="bg-[#409F83] h-[34px] w-full flex items-center relative rounded-md"
        >
          <span className="ml-2">
            <FilterIcon />
          </span>
          <span className="text-white absolute left-1/2 -translate-x-1/2">Filter</span>
        </button>
        <h3 className=" font-medium w-full sm:w-1/2 text-base lg:text-xl  pl-4 mt-8 ">Public Playlists</h3>
      </div>

      <div className="flex flex-wrap w-full mx-auto  md:justify-start mt-4 ">
        {loading ? (
          <div className="w-full flex justify-center">
            <LoadingButton />
          </div>
        ) : (
          <>
            {dataPlaylist.length === 0 && (
              <div className="w-full mt-10">
                <p className="text-center text-base">Not found playlists</p>
              </div>
            )}
            <>
              {dataPlaylist &&
                dataPlaylist.map((item: any, index: number) => (
                  <div key={index} className="my-2 w-1/2   px-2 lg:w-1/3  xl:w-1/4 block relative cursor-pointer ">
                    <article
                      className="overflow-hidden px-4 xs:px-[1.5rem]   mb-[15px] shadow-lg rounded-lg h-full bg-white cursor-pointer"
                      onClick={() => handleClickPlayItem(item)}
                    >
                      <div className='relative'>
                        {!item?.image ? (
                          <LazyImage
                            alt="photo"
                            className="block  mt-[10%] sm:mt-[15%] h-auto w-full sm:w-4/5 rounded-md mx-auto"
                            src={photoItem}
                          />
                        ) : (
                          <LazyImage
                            alt="photo"
                            className="block  mt-[10%] sm:mt-[15%] h-auto w-full sm:w-4/5 rounded-md mx-auto"
                            src={item.image}
                          />
                        )}
                        <div className='absolute top-2 right-2 sm:pr-[10%]'>
                          <svg
                            viewBox="0 0 16 18"
                            onClick={(e) => handleVote(e, item)}
                            fill={item.isVoted ? '#059f83' : 'none'}
                            xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-white duration-150 cursor-pointer mb-[5px]`}>
                            <path d="M11.3557 6.68098C11.238 6.36703 14.4852 3.46745 12.5922 1.11728C12.15 0.567875 10.6455 3.74824 8.51087 5.18808C7.33302 5.98234 4.59207 7.67533 4.59207 8.60777V14.6584C4.59207 15.7827 8.93757 16.9727 12.2401 16.9727C13.4505 16.9727 15.2043 9.38821 15.2043 8.18438C15.2043 6.98056 11.4712 6.99603 11.3557 6.68098ZM3.70771 6.76499C3.34852 6.76015 2.99216 6.82917 2.66075 6.96779C2.32934 7.10641 2.02996 7.31166 1.78118 7.5708C1.5324 7.82995 1.33954 8.13745 1.21456 8.47424C1.08958 8.81102 1.03515 9.1699 1.05465 9.5286V13.8161C1.03519 14.1704 1.09036 14.5248 1.21657 14.8564C1.34279 15.1881 1.53724 15.4895 1.78733 15.7412C2.03743 15.9929 2.3376 16.1893 2.66841 16.3176C2.99922 16.446 3.35329 16.5034 3.70771 16.4863C4.28862 16.4863 2.82336 15.9805 2.82336 14.4876V8.84986C2.82336 7.28621 4.28862 6.76389 3.70771 6.76389V6.76499Z" stroke="currentColor" />
                          </svg>
                          <svg
                            className={`h-6 w-6 text-white duration-150 cursor-pointer`}
                            viewBox="0 0 24 24"
                            stroke="white"
                            onClick={(e) => handleFavorite(e, item)}
                            fill={item.is_favorite == 1 ? '#059f83' : 'none'}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1"
                              stroke="white"
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        </div>
                      </div>
                      <header className="py-[10px] px-5  h-auto text-center">
                        <span className="no-underline hover:underline text-black font-semibold text-[17px] block truncate overflow-hidden ">
                          {item?.name ? item.name : 'No name'}
                        </span>

                        <p className="text-center text-[#333333] block truncate">{item?.description}</p>
                        <p className="text-center  text-[#333333]">Vote: {item?.vote_count}</p>
                      </header>
                    </article>
                  </div>
                ))}
              {pagination.total > 0 && (
                <div className="w-full flex flex-col-reverse items-end xl:flex-row  ">
                  <div className="w-full ">
                    <ReactPaginate
                      previousLabel="<<"
                      nextLabel=">>"
                      breakLabel={'...'}
                      pageCount={Math.ceil(pagination.total / pagination.perPage)}
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
                      forcePage={pagination.page - 1}
                    />
                  </div>

                  <label className="flex items-center ml-2 font-medium mb-2 xl:mb-0">
                    <span className="inline-block text-clgreen min-w-[130px] w-auo">Per page</span>
                    <select
                      className="h-9 min-w-[40px] border text-clgreen focus:outline-none"
                      value={pagination.perPage}
                      onChange={(e) => handleItemsPerPageChange(e)}
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </label>
                </div>
              )}
            </>
          </>
        )}
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

export default PlayLists;
