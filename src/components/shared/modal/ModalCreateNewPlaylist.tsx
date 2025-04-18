import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { AuthContext } from '~/components/context/AppProvider';
import { getPlayList, savePlayList } from '~/services/PlaylistServices';

const ModalCreateNewPlaylist = (props: any) => {
  const {
    isOpenCreatePlaylist,
    handleClickCloseCreatePlaylist,
    handleOverlayClick,
    userID,
    setDataMyPlaylist,
    
  } = useContext(AuthContext);
  const [inforNewPlaylist, setInforNewPlaylist] = useState('');
  const [notifications, setNotifications] = useState('');
  const [loading, setLoading] = useState(false);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e: any) => {
    const { value } = e.target;
    if (value.trim() === '') {
      setNotifications('Please enter Playlist Name.');
    } else {
      setNotifications('');
    }
    setInforNewPlaylist(value);
  };

  const handleCreateNewPlaylist = async () => {
    setLoading(true);
    try {
      if (inforNewPlaylist !== '') {
        const resSave = await savePlayList({ name: inforNewPlaylist });
        try {
          toast.success('Create new playlist success')
          const res = await getPlayList(userID);
          setDataMyPlaylist(res.data?.playlist);
          await handleClickCloseCreatePlaylist();
          setInforNewPlaylist('');
          if(resSave.data?.playlist[0].data?.id){
            navigate(`/playlists?id=${resSave.data?.playlist[0].data?.id}`)
          }
          setLoading(false);

        } catch (error) {
          toast.success('Create new playlist error')
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === 'Enter' && buttonRef.current) {
        buttonRef.current.click();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div
      onClick={(e) => handleOverlayClick(e)}
      className={` ${isOpenCreatePlaylist ? 'w-screen min-h-screen h-full absolute top-0 bg-black bg-opacity-20 z-50' : 'hidden'
        }   `}
    >
      <div
        className={`z-10  duration-200 ease-linear p-4 ${isOpenCreatePlaylist ? 'translate-y-1/2 opacity-100 visible ' : 'top-0 opacity-0 invisible'
          } bg-white shadow-lg border border-gray rounded-md fixed top-0 left-1/2 -translate-x-1/2`}
      >
        <h1 className="text-center font-medium pb-[15px] text-[#059f83]">Create New Playlist</h1>
        <hr />
        <div className="flex flex-col mb-2">
          <label className="mb-2 font-medium" htmlFor="playlist_name">
            Playlist Name:
          </label>
          <input
            className="border border-gray outline-none p-1 h-[34px] rounded-sm"
            type="text"
            name="playlist_name"
            id="playlist_name"
            value={inforNewPlaylist}
            onChange={(e) => handleChange(e)}
          />
          {notifications && <p className=" !mt-2 text-red-500 font-semibold text-center">{notifications}</p>}
        </div>
        <p className="text-[#059f83]">*You will have to again add frequency after creating playlist</p>
        <hr />
        <div className="flex items-center justify-end pt-4">
          <button
            onClick={() => handleClickCloseCreatePlaylist()}
            className="mx-1 px-4 h-9 py-2 rounded-sm shadow-md text-[12px] font-medium text-white bg-[#6C757D]"
          >
            Close
          </button>
          <div
            className="mx-1 px-4 h-9 py-2 rounded-sm shadow-md text-[12px] bg-[#059f83] font-medium text-white"
          >
            {loading ?
              <svg aria-hidden="true" className="w-4 h-4 text-green-200 animate-spin dark:text-green-600 fill-green-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg> : <button ref={buttonRef}  onClick={() => handleCreateNewPlaylist()}>Create</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCreateNewPlaylist;
