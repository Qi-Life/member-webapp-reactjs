import React, { useCallback, useContext, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import _ from 'lodash';

import SearchIcon from './shared/Icons/SearchIcon';
import FilterIcon from './shared/Icons/FilterIcon';
import photoItem from '~/assets/img/custom_playlist.jpeg';
import FeaturedFrequencies from './FeaturedFrequencies';
import { FreeFrequenciesType } from '~/interface/components.interface';
import { getFreeAlbums } from '~/services/AlbumServices';
import { isLogined } from '~/helpers/token';
import LazyImage from './shared/Loader/LazyImage';


const FreeFrequencies = (props: any) => {
  const { search } = useLocation();
  const sort = new URLSearchParams(search).get('sort');
  const [, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [statusChildMenu, setStatusChildMenu] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const { dataFreeFrequencies, setDataFreeFrequencies } = props;
  const linkImage = 'https://apiadmin.qienergy.ai/assets/uploads/mp3/';



  const handleChange = (e: any) => {
    if (e.target.value === '') {
      handleEnterSearch(e.target.value);
      setStatusChildMenu(false);
    } else {
      setStatusChildMenu(true);
    }
    setSearchInput(e.target.value);
  };

  const handleSearch = async (e: any) => {
    if (e.key === 'Enter' && e.target.value.trim() != '') {
      navigate(`/search?keyword=${e.target.value}`);
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

  const handleChangeSelect = (event: any) => {
    setSearchParams({ sort: event.target.value });
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

  const handleClickAlbum = (item: any) => {
    if (item?.requiredLogin && !isLogined()) {
      navigate('/register', { replace: true })
    }else{
      navigate(`/inner_frequencies?id=${item.id}&category=${item.categoryId}`)
    }
  }


  return (
    <div className="mb-4  ">
      <div className="w-full  mb-[15px] sm:flex hidden h-[27px] ">
        <h3 className=" font-medium w-1/3 text-base lg:text-xl   ">Free Frequencies</h3>
        <div className="flex w-1/3 items-center border bg-white rounded-md pl-3 py-[6px] h-[34px] relative">
          <SearchIcon w="16" h="16" />
          <input
            type="text"
            onChange={(e) => handleChange(e)}
            onKeyDown={handleSearch}
            className="w-full h-full outline-none border-none text-sm rounded-md block px-2.5 placeholder:text-black placeholder:font-medium"
            placeholder="Search albums, rife......"
          />
          {statusChildMenu ? (
            <div className="w-full bg-white border h-auto max-h-[250px] overflow-y-auto shadow-lg absolute right-0 left-0 top-[31px] z-20 ">
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
        <div className="w-1/3 flex items-center">
          <span className="w-1/3 text-right mr-2 m-auto font-medium ">Sort by:</span>
          <select
            id="countries"
            className="w-2/3 text-sm rounded-md block px-2.5 outline-none h-[34px] border"
            onChange={handleChangeSelect}
            defaultValue={sort !== null ? sort : 'recent'}
          >
            <option value="recent">Recent</option>
            <option value="favourite">Favorite</option>
            <option value="recommended">Recommended</option>
          </select>
        </div>
      </div>

      <div className="sm:hidden block mb-8">
        <div className="border border-[#9F9F9F] h-[34px] rounded-md w-full flex items-center relative my-4">
          <span className="ml-2">
            <SearchIcon w="28" h="28" />
          </span>
          <input
            type="text"
            className="text-[12px] font-light  w-full  bg-transparent border-none outline-none placeholder:text-center px-2"
            placeholder="Search"
            onChange={(e) => handleChange(e)}
            onKeyDown={handleSearch}
          />
        </div>
        <button type="button" className="bg-[#409F83] h-10 w-full flex items-center relative rounded-md">
          <span className="ml-2">
            <FilterIcon />
          </span>
          <span className="text-white absolute left-1/2 -translate-x-1/2">Filter</span>
        </button>
      </div>
      <div className="flex sm:flex-wrap  -mx-1">
        {dataFreeFrequencies.length === 0 ? (
          <div className="w-full mt-10">
            <p className="text-center text-base">Playlists Not Found</p>
          </div>
        ) : (
          <>
            {dataFreeFrequencies &&
              dataFreeFrequencies?.map((item: FreeFrequenciesType, index: number) => {
                return (
                  <div key={index} className="my-2 w-1/2   px-2 lg:w-1/3  xl:w-1/4 block relative cursor-pointer  ">
                    <a
                      onClick={() => handleClickAlbum(item)}
                      className="block overflow-hidden  px-[1.5rem]  mb-[15px]  shadow-lg h-full bg-white rounded-lg cursor-pointer"
                    >
                      {item?.image === null ? (
                        // eslint-disable-next-line camelcase
                        <LazyImage
                          alt="photo"
                          className=" block mt-[15%] h-auto w-[80%] sm:w-4/5 rounded-md mx-auto"
                          src={photoItem}
                        />
                      ) : (
                        <LazyImage
                          alt="photo"
                          className=" block mt-[15%] h-auto w-[80%] sm:w-4/5 rounded-md mx-auto"
                          src={`${linkImage}/${item.id}/${item.image}`}
                        />
                      )}

                      <header className="py-[10px] min-h-[55px] h-auto">
                        <h5 className=" text-center md:mt-[10px] mb-[5px] ">
                          <span className="no-underline hover:underline text-black font-semibold text-[17px] block truncate   ">
                            {item?.title}
                          </span>
                        </h5>
                      </header>
                    </a>
                  </div>
                );
              })}
          </>
        )}
      </div>
      <hr />
      <div className="hidden md:block">
        <FeaturedFrequencies />
      </div>
    </div>
  );
};

export default FreeFrequencies;
