import React from 'react';
import LeftIcon from './shared/Icons/LeftIcon';
import RightIcon from './shared/Icons/RightIcon';
import { isLogined, getAccessToken } from '~/helpers/token';

const Title = (props: any) => {
  const { title, handleClickLeft, handleClickRight } = props;

  return (
    <>
    { 
      ( isLogined() ) 
      ? (
        <div className="flex items-center justify-between mt-4 ">
        <h1 className="block md:hidden text-sm font-bold">{title}</h1>
        <div className="flex items-center justify-end w-full mb-4">
          <span className="cursor-pointer " onClick={handleClickLeft}>
            <LeftIcon />
          </span>
          <span className="cursor-pointer" onClick={handleClickRight}>
            <RightIcon />
          </span>
        </div>
        </div>
      ) : (
        <></>
      )
    }
    </>
    
  );
};

export default Title;
