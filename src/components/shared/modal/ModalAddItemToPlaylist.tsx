import React, { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import LoadingButton from '~/components/LoadingButton';

const ModalAddItemToPlaylist = (props: any) => {
  const {
    isOpen,
    inputValue,
    handleSave,
  } = props

  const [title, setTitle] = useState(inputValue);
  const [isLoading, setIsloading] = useState(false);

  const save = async () =>{
    setIsloading(false);
    setIsloading(true);
    setTimeout(async ()=>{
      const res = await handleSave(title)
      if(res.data.playlist[0].fetch_flag == 1)  {
        toast.success('Add to playlist successfully')
      }  else{
        toast.error('Add error')
      }
      setIsloading(false);
    }, 1000)
  }

  const onChangeTitleInput = async (e:any) =>{
    setTitle(e.target.value)
  }

  return (
    <div
      className={` ${isOpen ? 'w-screen h-[100%] absolute top-0 left-0 bottom-0 bg-black bg-opacity-20  z-[9999]' : 'hidden'}   `}
    >
      <div
        className={`max-w-[500px] w-full z-10  duration-200 ease-linear p-4 ${
          isOpen ? 'translate-y-1/2 opacity-100 visible ' : 'top-0 opacity-0 invisible'
        } bg-white shadow-lg border border-gray rounded-md fixed top-0 left-1/2 -translate-x-1/2`}
      >
        <h1 className="text-center text-[#059f83] p-[5px] font-bold">Add Frequency/Track To Playlist</h1>
        <form className="p-4">
          <div className="flex flex-col mb-3">
              <label className="mb-2 font-bold" htmlFor="name"> Custom Title</label>
              <input
                  className="border border-gray outline-none p-1 h-[34px] rounded-sm"
                  type="text"
                  name="name"
                  id="name"
                  value={title}
                  onChange={onChangeTitleInput}
              />
          </div>
           <div className='text-right'>
             {isLoading && <LoadingButton />}
                <button
                    type='button'
                    className="mx-1 h-[34px] px-[12px]  rounded-sm shadow-md  font-medium text-white bg-[#6C757D]"
                    onClick={props.onClose}
                >
                    Close
                </button>
                <button
                    type='button'
                    className="mx-1 h-[34px] px-[12px]  rounded-sm shadow-md  bg-[#059f83] font-medium text-white"
                    onClick={save}
                >
                    Add
                </button>
           </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAddItemToPlaylist;
