import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import photoItem from '~/assets/img/custom_playlist.jpeg';
import { FreeType } from '~/interface/components.interface';
import { AppContext } from './context/AppProvider';
import LazyImage from './shared/LazyImage';

const Free = (props: any) => {
  const { setInfoItem } = useContext(AppContext);
  const navigate = useNavigate();
  const { dataFreeFrequencies } = props;
  const linkImage = 'https://apiadmin.qienergy.ai/assets/uploads/mp3/';
  
  const handleClickPlayItem = (item: any) => {
    setInfoItem(item);
    navigate(`/inner_frequencies?id=${item.id}&category=${item.categoryId}`);
  };

  return (
    <div className="mt-2">
      <div className="md:hidden block">
        <h1 className="block md:hidden text-base font-bold">Free</h1>
      </div>
      <div className="md:hidden block">
        <div className="flex flex-wrap justify-between   ">
          {dataFreeFrequencies &&
            dataFreeFrequencies?.map((item: FreeType, index: number) => {
              return (
                <div key={index} className="my-2 w-1/2   px-2 lg:w-1/3  xl:w-1/4 block relative cursor-pointer ">
                  <article
                    onClick={() => handleClickPlayItem(item)}
                    className="overflow-hidden px-4 xs:px-[1.5rem]  mb-[15px]  shadow-lg h-full bg-white rounded-lg cursor-pointer"
                  >
                    {item?.image === null ? (
                      // eslint-disable-next-line camelcase
                      <LazyImage
                        alt="photo"
                        className="block mt-[10%] sm:mt-[15%] h-auto w-full sm:w-4/5 rounded-md mx-auto"
                        src={photoItem}
                      />
                    ) : (
                      <LazyImage
                        alt="photo"
                        className="block mt-[10%] sm:mt-[15%] h-auto w-full sm:w-4/5 rounded-md mx-auto"
                        src={`${linkImage}/${item.id}/${item.image}`}
                      />
                    )}

                    <header className="py-[10px] min-h-[55px] h-auto ">
                      <h5 className=" text-center   ">
                        <span className="w-full no-underline hover:underline  text-black font-semibold text-[17px] block truncate ">
                          {item?.title}
                        </span>
                      </h5>
                    </header>
                  </article>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Free;
