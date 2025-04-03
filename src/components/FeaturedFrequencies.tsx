import React, { useContext } from 'react';

import { AuthContext } from './context/AppProvider';
import { Link, useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa6';
import { checkLockAlbum } from '~/helpers/token';
const FeaturedFrequencies = () => {
  const navigate = useNavigate();
  const { dataFeatured } = useContext(AuthContext);
  const linkImage = 'https://apiadmin.qienergy.ai/assets/uploads/mp3/';
 
  return (
    <div className="">
      <div className="w-full flex mt-10 mb-5">
        <h1 className="font-medium w-full md:w-1/2 text-base lg:text-xl  pl-4 ">Featured Frequencies</h1>
      </div>
      <div className="">
        <div className="flex flex-wrap -mx-1">
          {dataFeatured &&
            dataFeatured.map((item: any, index: number) => {
              return (
                <div key={index} className="my-2 w-1/2   px-2 lg:w-1/3  xl:w-1/4 block relative ">
                  <Link
                    to={`/inner_frequencies?id=${item.id}&category=${item.categoryId}`}
                    className="block overflow-hidden px-[1.5rem]  mb-[15px]  shadow-lg h-full bg-white rounded-lg cursor-pointer"
                  >
                    <div className="relative">
                      <img
                        alt="photo"
                        className="block mt-[15%] h-auto w-[80%] sm:w-4/5 rounded-md mx-auto "
                        src={`${linkImage}/${item.id}/${item.image}`}
                      />
                      {checkLockAlbum(item) && (
                        <FaLock size={20} color="white" className="absolute bottom-[5%] right-[20%] z-10" />
                      )}
                    </div>
                    <header className="py-[10px] h-[55px] ">
                      <h5 className=" text-center md:mt-[10px] mb-[5px] ">
                        <span className="no-underline hover:underline text-black font-semibold text-[17px]  block truncate ">
                          {!item?.title ? 'No name' : item.title}
                        </span>
                      </h5>
                    </header>
                  </Link>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default FeaturedFrequencies;
