import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingButton from '~/components/LoadingButton';
import { AppContext } from '~/components/context/AppProvider';
import { getPlayList, savePlayList } from '~/services/PlaylistServices';

const ModalAddNewPlaylists = (props: any) => {
  const {
    isOpenNewPlaylists,
    handleClickClose,
    setStatusButton,
    userID,
    handleOverlayClick,
  } = useContext(AppContext);
  const navigate = useNavigate()

  const [inforNewPlaylist, setInforNewPlaylist] = useState({ name: '', description: '', private: 0 });
  const [notifications, setNotifications] = useState(Object);
  const [loading, setLoading] = useState(false);
  const search = useLocation().search;
  const keyword = String(new URLSearchParams(search).get('keyword') ?? '');


  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setInforNewPlaylist({ ...inforNewPlaylist, [name]: value });
    const newNotifications = { ...notifications };
    if (name === 'name') {
      newNotifications.name = value.trim() === '' ? 'Please enter name.' : '';
    }
    if (name === 'description') {
      newNotifications.description = value.trim() === '' ? 'Please enter Description.' : '';
    }
    setNotifications(newNotifications);
  };

  const handleAddPlaylist = async () => {
    setStatusButton(true);
    try {
      if (inforNewPlaylist.name !== '') {
        const resSave = await savePlayList(inforNewPlaylist);
        try {
          setLoading(true);
          const res = await getPlayList(userID, keyword);
          props.setDataMyPlaylist(res.data?.playlist);
          await handleClickClose();
          setInforNewPlaylist({ ...inforNewPlaylist, name: '', description: '' });
          setLoading(false);
          toast.success('Create new playlist success')
          navigate(`playlists?id=${resSave?.data?.playlist[0].data.id}`)
        } catch (error) {
          setLoading(false);
          toast.error('Create playlist error')
        }
      } else {
        setNotifications({
          name: 'Please enter name.',
        });
      }
      setStatusButton(false);
    } catch (error) {
      setStatusButton(false);
      console.log('🚀 ~ file: ModalAddNewPlaylists.tsx:64 ~ handleAddPlaylist ~ error:', error);
    }
  };

  const handleCloseModal = () => {
    handleClickClose();
    setInforNewPlaylist({ name: '', description: '', private: 0 });
  };

  const handleChangePrivate = (isPrivate: any) => {
    setInforNewPlaylist({ ...inforNewPlaylist, private: isPrivate });
  };

  return (
    <div
      onClick={(e) => handleOverlayClick(e)}
      className={` ${
        isOpenNewPlaylists ? 'w-screen min-h-screen h-full absolute top-0 bg-black bg-opacity-20 z-[9999]' : 'hidden'
      }   `}
    >
      <div
        className={`max-w-[500px] w-full z-50  duration-200 ease-linear p-4 ${
          isOpenNewPlaylists ? 'translate-y-[20%] opacity-100 visible ' : 'top-0 opacity-0 invisible'
        } bg-white shadow-lg border border-gray rounded-md fixed top-0 left-1/2 -translate-x-1/2`}
      >
        <h1 className="text-center font-medium pb-[15px] text-[#059f83]">Add New Playlists</h1>
        <hr />
        <form action="" className="p-4" encType="multipart/form-data">
          <div className="flex flex-col mb-2">
            <label className="mb-2 font-medium" htmlFor="name">
              Title:
            </label>
            <input
              className="border border-gray outline-none p-1 h-[34px] rounded-sm"
              type="text"
              onChange={(e) => handleChange(e)}
              value={inforNewPlaylist.name}
              name="name"
              id="name"
            />
            {notifications.name && (
              <p className=" !mt-2 text-red-500 font-semibold text-center">{notifications.name}</p>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <label className="mb-2 font-medium" htmlFor="description">
              Description:
            </label>
            <textarea
              className="border border-gray rounded-sm p-2 outline-none"
              name="description"
              id="description"
              value={inforNewPlaylist.description}
              onChange={(e) => handleChange(e)}
              cols={30}
              rows={2}
            />
            {notifications.description && (
              <p className=" !mt-2 text-red-500 font-semibold text-center">{notifications.description}</p>
            )}
          </div>
          <label className="flex bg-gray-100 text-gray-700 rounded-md px-3 py-2 my-3  hover:bg-green-200 cursor-pointer ">
            <input
              type="radio"
              name="private"
              value={1}
              checked={inforNewPlaylist.private == 1}
              onChange={() => handleChangePrivate(1)}
            />
            <span className="pl-2">Private</span>
          </label>
          <label className="flex bg-gray-100 text-gray-700 rounded-md px-3 py-2 my-3  hover:bg-green-200 cursor-pointer ">
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
        <div className="flex items-center justify-end py-4">
          <button
            onClick={() => handleCloseModal()}
            className="mx-1 px-3 py-1 h-9 rounded-sm shadow-md text-[12px] font-medium text-white bg-[#6C757D]"
          >
            Close
          </button>
          <button
            disabled={loading}
            onClick={() => handleAddPlaylist()}
            className="mx-1 px-3 h-9 py-1 rounded-sm shadow-md text-[12px] bg-[#059f83] font-medium text-white ic-center"
          >
            Add
            {loading && <LoadingButton />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAddNewPlaylists;
