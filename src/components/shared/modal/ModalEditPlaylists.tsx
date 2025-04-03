import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '~/components/context/AppProvider';
import { getPlayList, savePlayList } from '~/services/PlaylistServices';

const ModalEditPlaylists = (props: any) => {
  const {
    isOpenEditPlaylists,
    currentPlaylistEdit,
    updateCurrentPlayList,
    handleClickClosePlaylist,
    setDataMyPlaylist,
    userID,
    handleClickClose,
  } = useContext(AuthContext);
  const [isLoading, setIsloading] = useState(false)

  const [inforNewPlaylist, setInforNewPlaylist] = useState({ ...currentPlaylistEdit });

  const handleChange = (e: any) => {
    setInforNewPlaylist({ ...inforNewPlaylist, [e.target.name]: e.target.value });
  };

  const handleAddPlaylist = async () => {
    setIsloading(true);
    const firstText = inforNewPlaylist.id ? 'Edit' : 'Add'
    const savePlaylistRes = await savePlayList({
      id: inforNewPlaylist.id,
      name: inforNewPlaylist.name,
      description: inforNewPlaylist.description,
      private: inforNewPlaylist.private
    });
    const res = await getPlayList(userID);
    setDataMyPlaylist(res.data?.playlist);
    await handleClickClosePlaylist();
    await handleClickClose();
    setInforNewPlaylist({ ...inforNewPlaylist });
    updateCurrentPlayList(inforNewPlaylist);
    if(savePlaylistRes.data.playlist[0].fetch_flag == 1){      
      toast.success(`${firstText} playlist successfully`);
    }else{
      toast.error(`${savePlaylistRes.data?.playlist[0].rsp_msg}`)
    }
    setIsloading(false);
  };

  const handleOverlayClick = (e: any) => {
    if (e.target === e.currentTarget) {
      handleClickClose();
    }
  };

  useEffect(() => {
    if (currentPlaylistEdit) {
      setInforNewPlaylist(currentPlaylistEdit);
    }
  }, [currentPlaylistEdit]);

  const handleChangePrivate = (isPrivate: any) => {
    setInforNewPlaylist({ ...inforNewPlaylist, private: isPrivate });
  };

  return (
    <div
      onClick={(e) => {
        handleOverlayClick(e);
      }}
      className={` ${isOpenEditPlaylists ? 'w-screen min-h-screen h-full absolute top-0 bg-black bg-opacity-20  z-[9999]' : 'hidden'
        }   `}
    >
      <div
        className={`max-w-[500px] w-full z-10  duration-200 ease-linear  ${isOpenEditPlaylists ? 'translate-y-1/2 opacity-100 visible ' : 'top-0 opacity-0 invisible'
          } bg-white shadow-lg border border-gray rounded-md absolute top-0 left-1/2 -translate-x-1/2`}
      >
        <h1 className="text-center font-bold pb-[15px] text-[#059f83] p-[15px]">Edit Playlist</h1>
        <hr />
        <form action="" className="py-[15px] px-[30px] space-y-5" encType="multipart/form-data">
          <div className="flex flex-col">
            <label className="mb-[5px] font-bold" htmlFor="title">
              Playlist Name:
            </label>
            <input
              className="border border-gray outline-none p-1 h-[34px] rounded-sm"
              type="text"
              value={inforNewPlaylist.name}
              onChange={handleChange}
              name="name"
              id="name"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-bold" htmlFor="description">
              Description:
            </label>
            <textarea
              className="border border-gray rounded-sm p-2 outline-none"
              name="description"
              id="description"
              value={inforNewPlaylist.description}
              onChange={handleChange}
              cols={30}
              rows={2}
            />
          </div>
          <label className="flex bg-gray-100 text-gray-700 rounded-md px-3 py-2 my-3  hover:bg-[#059f83] cursor-pointer ">
            <input
              type="radio"
              name="private"
              value={1}
              checked={inforNewPlaylist.private == 1}
              onChange={() => handleChangePrivate(1)}
            />
            <span className="pl-2">Private</span>
          </label>
          <label className="flex bg-gray-100 text-gray-700 rounded-md px-3 py-2 my-3  hover:bg-[#059f83] cursor-pointer ">
            <input
              type="radio"
              name="private"
              value={1}
              checked={inforNewPlaylist.private == 0}
              onChange={() => handleChangePrivate(0)}
            />
            <span className="pl-2">Public</span>
          </label>
        </form>
        <hr />
        <div className="flex items-center justify-end p-[15px]">
          <button
            onClick={() => handleClickClose()}
            className="mx-1 px-3 py-1  rounded-sm shadow-md h-[34px] font-bold text-white bg-[#6C757D]"
          >
            Close
          </button>
          <button
            disabled={isLoading}
            onClick={() => handleAddPlaylist()}
            className="mx-1 px-3  py-1 rounded-sm shadow-md h-[34px] bg-[#059f83] font-bold text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditPlaylists;
