import React, { useState, useEffect } from 'react';
import SearchIcon from '~/components/shared/Icons/SearchIcon';
import { FreeType } from '~/interface/components.interface';
import photoItem from '~/assets/img/custom_playlist.jpeg';
import { getFreeAlbums } from '~/services/AlbumServices';

const Basic = () => {
  const [dataBasic, setDataBasic] = useState([]);
  const linkImage = 'https://apiadmin.qienergy.ai/assets/uploads/mp3/';
  const getDataBasic = async () => {
    try {
      const resBasic = await getFreeAlbums();
      if (resBasic?.data?.free_albums.length > 0) {
        setDataBasic(resBasic?.data?.free_albums);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getDataBasic();
  }, []);

  return (
    <>
      <div>
        <div className="w-full  mb-5 sm:flex hidden h-[27px]">
          <h3 className=" font-medium w-1/3 text-base lg:text-xl  pl-4  ">Free Frequencies</h3>
          <div className="flex w-1/3 items-center bg-white rounded-md pl-2">
            <SearchIcon w="16" h="16" />
            <input
              type="text"
              id="search"
              className="w-full h-full outline-none border-none text-sm rounded-md block px-2.5"
              placeholder="Search..."
            />
          </div>
          <div className="w-1/3 flex">
            <span className="w-1/3 text-center m-auto font-medium text-[12px]">Sort by:</span>
            <select id="countries" className="w-2/3 text-sm rounded-md block px-2.5 outline-none ">
              <option defaultValue="recent" selected>
                Recent
              </option>
              <option value="favourite">Favorite</option>
              <option value="recommended">Recommended</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap flex-1  ">
        {dataBasic &&
          dataBasic?.map((item: FreeType, index: number) => {
            return (
              <div key={index} className="my-1 p-2  w-1/2 md:px-4 lg:my-4 lg:px-4 lg:w-1/4 block ">
                <article className="overflow-hidden rounded-lg shadow-lg h-full bg-white">
                  {item?.image === null ? (
                    // eslint-disable-next-line camelcase
                    <img alt="photo" className="block h-auto w-full" src={photoItem} />
                  ) : (
                    <img alt="photo" className="block h-auto w-full" src={`${linkImage}/${item.id}/${item.image}`} />
                  )}

                  <header className="bg-white p-2 md:p-4">
                    <h1 className="text-lg text-center">
                      <span className="no-underline hover:underline text-black font-semibold text-[11px] sm:text-sm">
                        {item?.title}
                      </span>
                    </h1>
                  </header>
                </article>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Basic;
