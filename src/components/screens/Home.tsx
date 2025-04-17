import React, { useState, useEffect, useCallback, useContext } from 'react';
import Head from '~/components/shared/Head';
import Free from '../Free';

import Featured from '../Featured';

import FilterIcon from '../shared/Icons/FilterIcon';
import Favorites from '~/components/Favorites';
import FreeFrequencies from '../FreeFrequencies';
import { getFreeAlbums } from '~/services/AlbumServices';
import SideBarMenuModal from '../shared/SidebarMenu/SideBarMenuModal';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import _ from 'lodash';
import LoadingButton from '../LoadingButton';

import ScrollToTop from '../ScrollToTop';
import { AppContext } from '../context/AppProvider';
import SearchForm from '../shared/SearchForm';

import QiciolMaxBanner from '../../assets/img/banner/bn-mobile/qicoil-max-scalar_348x43_strip-banner.jpg'
import EducationBanner from '../../assets/img/banner/bn-mobile/Education_348x43_strip-banner.jpg'
import AcademyBanner from '../../assets/img/banner/bn-mobile/qilife-academy_348x43_strip-banner.jpg'
import QiCenterBanner from '../../assets/img/banner/bn-mobile/qilifecenter_348x43_strip-banner.jpg'
import HOLISTICBanner from '../../assets/img/banner/h_banner.jpg'


export default function HomeScreen() {
  const { search, pathname } = useLocation();
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();
  const [statusChildMenu, setStatusChildMenu] = useState(false);

  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataFreeFrequencies, setDataFreeFrequencies] = useState([]);
  const keyword = String(new URLSearchParams(search).get('keyword') ?? '');
  const { statusScrollTop, setStatusScrollTop, setShowModal, setPathName } = useContext(AppContext);

  const getDataFreeFrequencies = async () => {
    setPathName(pathname);
    try {
      setLoading(true);
      const res = await getFreeAlbums(keyword || '');
      if (res?.data.free_albums.length > 0) {
        const basic_albums = res?.data.free_albums.map((item: any) => {
          if (item.id != 5964) {
            item.requiredLogin = true
          }
          return item
        })
        setDataFreeFrequencies(basic_albums);
        localStorage.setItem('album_free', res?.data.free_albums.map((item: any) => item.id).join(','));
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const debouncedUpdate = useCallback(
    _.debounce((value) => {
      handleEnterSearch(value);
    }, 1000),
    []
  );

  const handleSearch = async (value: string) => {
    if (value.trim() !== '') {
      navigate(`/search?keyword=${value}`);
    }
  };
  const handleEnterSearch = async (search: any) => {
    if (search === ' ') {
      // const res = await getFreeAlbums();
      // setDataFreeFrequencies(res.data.free_albums);
    } else {
      const res = await getFreeAlbums(search);
      setDataFreeFrequencies(res.data.free_albums);
    }
  };
  const handleClickSearchInput = (item: any) => {
    handleEnterSearch(item.title);
    if (item.title === '') {
      setSearchParams('');
    } else {
      setSearchParams({ keyword: item.title });
    }
    setStatusChildMenu(false);
  };

  useEffect(() => {
    getDataFreeFrequencies();
  }, []);

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
  }, []); // Empty dependency array ensures the effect runs only once during component mount

  const handleClickToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <Head title="Home" />

      {loading ? (
        <div className="h-[20vh] flex items-end justify-center">
          <LoadingButton />
        </div>
      ) : (
        <div className="bg-[#ecf5f4]  ">
          <div className="flex  mx-auto w-full">
            <div className=" w-full">
              <div className="hidden md:block">
                <div className="mb-4 ">
                  <div className="flex sm:flex-wrap  -mx-1">
                    <FreeFrequencies
                      dataFreeFrequencies={dataFreeFrequencies}
                      setDataFreeFrequencies={setDataFreeFrequencies}
                    />
                  </div>
                </div>
              </div>
              <div className="md:hidden block my-5 relative">
                <div className='md:w-1/3'>
                  <SearchForm onSearch={handleSearch} />
                </div>
                <button
                  type="button"
                  className="bg-[#409F83] h-9 w-full  mx-auto flex items-center relative rounded-md cursor-pointer"
                  onClick={() => setShowModal(true)}
                >
                  <span className="ml-2 ">
                    <FilterIcon />
                  </span>
                  <span className="text-white absolute left-1/2 text-base -translate-x-1/2 ">Filter</span>
                </button>
                {statusChildMenu ? (
                  <div className="w-full bg-white border h-auto max-h-[250px] overflow-y-auto shadow-lg absolute right-0 left-0 top-8 !z-10 ">
                    {dataFreeFrequencies &&
                      dataFreeFrequencies
                        .filter((filterItem: any) => filterItem.title?.toLowerCase().indexOf(searchInput) >= 0)
                        .map((item: any, index: number) => {
                          return (
                            <p
                              className="p-1 mb-1 hover:bg-[#ECF5F4] hover:underline duration-100 cursor-pointer"
                              onClick={() => handleClickSearchInput(item)}
                              key={index}
                            >
                              {item?.title}
                            </p>
                          );
                        })}
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className="block md:hidden">
                <Favorites />
              </div>

              <Free dataFreeFrequencies={dataFreeFrequencies} setDataFreeFrequencies={setDataFreeFrequencies} />

              <div className="md:hidden block my-4">
                <hr />
                <Featured />
              </div>
              <div className="md:hidden block flex flex-col gap-2">
                <a onClick={()=>navigate('/holistic-health/m-landing')}>
                  <img alt="banner" className="w-full mx-auhref " src={HOLISTICBanner} />
                </a>
                <a href="https://qilifestore.com/collections/qi-coils" target='_blank'>
                  <img alt="banner" className="w-full mx-auhref " src={QiciolMaxBanner} />
                </a>
                <a href="https://qilifestore.com/collections/education" target='_blank'>
                  <img alt="banner" className="w-full mx-auhref " src={EducationBanner} />
                </a>
                <a href="https://qilifestore.com/pages/qi-life-academy" target='_blank'>
                  <img alt="banner" className="w-full mx-auhref " src={AcademyBanner} />
                </a>
                <a href=" https://qilifestore.com/pages/qi-life-center-license" target='_blank'>
                  <img alt="banner" className="w-full mx-auhref " src={QiCenterBanner} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <SideBarMenuModal />

      {statusScrollTop && (
        <div onClick={() => handleClickToTop()} className="fixed bottom-5 right-5">
          <ScrollToTop />
        </div>
      )}
    </>
  );
}
