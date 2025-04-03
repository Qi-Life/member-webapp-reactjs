// DropdownButton.js
import React, { useState, useEffect, useRef, ReactNode, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '~/components/context/AppProvider';
import { isLogined, getAccessToken } from '~/helpers/token';
import { AddFrequencytoPlaylist } from '~/services/FrequencyServices';
import ModalAddItemToPlaylist from '../modal/ModalAddItemToPlaylist';


interface DropdownProps {
  id: string;
  items: any;
  albumTitle?: string,
  albumId?: string,
  buttonContent: ReactNode;
  placement: string;
  trackList?: any[];
  background: string;
  className?: string;
}

const DropdownButton: React.FC<DropdownProps> = ({ id, buttonContent, trackList, background, className, albumTitle, albumId }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isShowModalAddItemToPlaylist, setShowModalAddItemToPlaylist] = useState(false);
  const { dataMyPlaylist, handleClickCreatePlaylist } = useContext(AuthContext);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);

  const dropdownRef = useRef(null);
  const modalAddItemPlaylistRef = useRef(null);

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleOutsideClick = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  const handleShowModal = () => {
    if (!isLogined()) {
      navigate('/login');
    } else {
      handleClickCreatePlaylist();
    }
  };

  const saveModalAddItemToPlaylist = async (title: string) => {
    const trackAdds = trackList.map((trackItem: any) => {
      return {
        title,
        value: [trackItem.id],
        key: albumId,
        frequency_type: trackItem.type,
      }
    })
    const data = {
      playlist_id: currentPlaylist.id,
      playlistItem: trackAdds,
      type: "add"
    };

    setDropdownOpen(false);
    setShowModalAddItemToPlaylist(false)
    await AddFrequencytoPlaylist(data);
    navigate(`/playlists?id=${currentPlaylist.id}`)
  };

  const showModalAddItemToPlayList = (playlist: any) => {
    setShowModalAddItemToPlaylist(true)
    setCurrentPlaylist(playlist)
    setDropdownOpen(false);
  }

  const hideModalAddItemToPlayList = () => {
    setShowModalAddItemToPlaylist(false)
  }

  return (
    <>
      <div ref={dropdownRef}>
        <button
          id={`dropdownDefaultButton${id}`}
          data-dropdown-toggle="dropdown"
          onClick={toggleDropdown}
          className={`text-white ${background} focus:outline-none font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center`}
          type="button"
          data-dropdown-placement="left"
        >
          {buttonContent}
        </button>

        {isDropdownOpen && (
          <>
            <div
              id={`dropdown${id}`}
              className={`z-20 block bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 absolute right-[10px] ${className}`}
              aria-labelledby={`dropdownDefaultButton${id}`}
            >
              <div className="max-h-[300px] w-[200px] overflow-y-auto text-center">
                <div onClick={() => handleShowModal()} className='bg-inherit'>
                  <span className="block text-sm px-4 py-3  border-b-1 text-green-700 font-medium dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-default">
                    Create playlist
                  </span>
                </div>
                <hr />
                {!isLogined() ? (
                  <></>
                ) : (
                  <>
                    <ul className="text-sm text-gray-700 dark:text-gray-200 py-1">
                      {dataMyPlaylist &&
                        Array.from(dataMyPlaylist).map((item: any, index: number) => {
                          return (
                            <li className="cursor-pointer" key={index}>
                              <a
                                className="capitalize block px-4 py-[5px] hover:bg-gray-100 font-medium dark:hover:bg-gray-600 dark:hover:text-white hover:underline  overflow-ellipsis whitespace-nowrap truncate ..."
                                onClick={() => showModalAddItemToPlayList(item)}
                              >
                                {item.name}
                              </a>
                            </li>
                          );
                        })}
                    </ul>
                  </>
                )}
              </div>
            </div>
            <div
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              className="w-screen h-screen bg-black bg-opacity-20 fixed top-0 left-0 z-10"
            ></div>

          </>
        )}
      </div>
      {isShowModalAddItemToPlaylist &&
        <div ref={modalAddItemPlaylistRef} >
          <ModalAddItemToPlaylist
            inputValue={albumTitle}
            isOpen={isShowModalAddItemToPlaylist}
            handleSave={saveModalAddItemToPlaylist}
            onClose={hideModalAddItemToPlayList}
          />
        </div>}
    </>
  );
};

export default DropdownButton;
