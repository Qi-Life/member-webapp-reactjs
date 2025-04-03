import React, { useState, useEffect, useRef, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { TiEdit } from 'react-icons/ti';
import { IoClose } from 'react-icons/io5';
import { RiDeleteBin6Line } from 'react-icons/ri';
import SearchIcon from '~/components/shared/Icons/SearchIcon';
import left from '~/assets/img/playlist/left.png';
import photoItem from '~/assets/img/custom_playlist.jpeg';
import frequencyImage from '~/assets/img/image/frequency.png';
import DuplicateIcon from '~/assets/img/Duplicate.png';
import Frame599 from '~/assets/img/Frame 599.png';

import { deletePlayList, getPlaylistByUser, savePlayList, votePlayList } from '~/services/PlaylistServices';
import { AuthContext } from '~/components/context/AppProvider';
import { FaLock } from 'react-icons/fa';
import { getTrack } from '~/services/InnerFrequenciesServices';
import ModalAddNewFrequency from '~/components/shared/modal/ModalAddNewFrequency';
import LoadingButton from '~/components/LoadingButton';
import { checkLockAlbum, isLogined } from '~/helpers/token';
import { toast } from 'react-toastify';
import { useAudio } from '~/components/context/AudioProvider';
import { MdOutlinePlaylistAdd } from "react-icons/md";
import AudioPlayer from '~/components/shared/Audio/AudioPlayer';
import Head from '~/components/shared/Head';
import Switcher from '~/components/shared/Switcher';
import { saveFavorite } from '~/services/FavoritesServices';
import NavigateDropdown from '~/components/shared/Dropdown/NavigateDropdown';

declare global {
  interface Window {
    MSStream: any;
  }
}

const PlaylistsItem = (props: any) => {
  const {
    userID,
    getMyPlaylist,
    currentPlaylistEdit,
    handleClickAddNewFrequency,
    handleClickEditPlaylists,
    loading,
    setLoading,
    setIsOpenNewPlaylist,
  } = useContext(AuthContext);

  const {
    playIndex,
    isLoading, isPlay, isShowAdvancedMode,
    clearAll,
    setIsPlayType,
    playlistId,
    playlists
  } = useAudio();

  const { search } = useLocation();

  const _playlistId = String(new URLSearchParams(search).get('id') ?? '');
  const cateoryId = String(new URLSearchParams(search).get('category') ?? '');
  const navigate = useNavigate();
  const [playInforItem, setPlayInforItem] = useState<any>([]);
  const [statusHeart, setStatusHeart] = useState(false);
  const [statusTrack, setStatusTrack] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [_playIndex, _setPlayIndex] = useState(null)
  const [silentScalarPlays, setSilentScalarPlays] = useState([])
  const [isOpenSilentDropDown, setIsOpenSilentDropDown] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [playlistItemData, setPlaylistItemData] = useState(Object);
  const [tracks, setTracks] = useState([]);
  const linkImage = 'https://apiadmin.qienergy.ai/assets/uploads/mp3/';

  const audioPlayerRef = useRef(null);

  const handleConvert = (mp3_ids: any) => {
    const queryString = mp3_ids.map((id: any) => `trackids[]=${id}`).join('&');
    return queryString;
  };

  const generateTracks = (playlistItem: [], resTrack: any) => {
    let newTracks: any[] = [];
    let keyIndex = 0
    playlistItem.map((item: any) => {
      try {
        keyIndex += 1
        newTracks = [...newTracks, {
          key: item.key,
          albumTitle: item.title,
          id: null,
          url: null,
          keyIndex,
          isOpen: false
        }];

        if (item.frequency_type != 'mp3') {
          item.value.map((r: any) => {
            newTracks = [...newTracks, {
              key: item.key,
              title: r + ' Hz',
              url: +r,
              lock: false,
              id: r,
              keyIndex,
              frequency_type: item.frequency_type
            }]
          })
        } else {
          item.value.map((r: any) => {
            const resultItem = resTrack?.find((_resItem: any) => _resItem.id == r);
            const checkLocked = !!resTrack?.find((item: any) => checkLockAlbum({ ...resultItem, id: resultItem?.frequency_id }));
            setIsLocked(checkLocked)
            if (resultItem)
              newTracks.push({
                key: item.key,
                title: resultItem.name,
                url: resultItem.audio_file,
                lock: checkLocked,
                id: resultItem.id,
                keyIndex,
                frequency_type: item.frequency_type
              });
          })
        }
        keyIndex += item.value.length;
      } catch (error) {
        console.log('🚀 ~ file: PlaylistsItem.tsx:83 ~ frequency_id.split ~ error:', error);
      }
    });
    setStatusTrack(false);
    setTracks(newTracks);
    return newTracks
  }

  const getDataPlayInforItem = async () => {
    try {
      const res = await getPlaylistByUser(userID, _playlistId);
      if (res.data.playlist?.fetch_flag === -1) {
        navigate('/not-found');
      } else {
        setPlayInforItem(res.data?.playlist);
        setStatusHeart(!!res.data?.playlist.vote_ids?.split(',').find((_voteItem: any) => _voteItem == userID));

        const playlistItem = JSON.parse(res.data?.playlist?.playlist_items);
        setIsPlayType('playlist')

        let mp3_ids: any[] = [];
        let resTrack: any[] = [];
        playlistItem.filter((item: any) => item.frequency_type == 'mp3').map((item: any) => {
          mp3_ids = mp3_ids.concat(item.value)
        });
        if (mp3_ids.length > 0) {
          const resTrackSponse = await getTrack(handleConvert(mp3_ids));
          resTrack = resTrackSponse.data?.tracks;
        }
        setPlaylistItemData({
          resTrack,
          playlistItem
        })
        generateTracks(playlistItem, resTrack)
      }
      loadImage();
    } catch (error) {
      setLoading(false);
      setStatusTrack(false);
    }

    setTimeout(() => {
      setStatusTrack(false);
    }, 4300);
  };
  const handleAdd = async () => {
    await getDataPlayInforItem();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    getDataPlayInforItem();
    scrollToTop();
    getMyPlaylist();
  }, []);


  const handleDelItem = async (event: any, itemDelete: any, index: number, trackIndex:number) => {
    console.log('item.key', index, itemDelete)

    event.stopPropagation()
    const userConfirmed = confirm('Are you sure you want to delete!');
    if (userConfirmed) {
      // Perform the action you want to do when the user confirms
      try {
        let newItemDatas = playlistItemData.playlistItem.map((item: any) => {
          if (item.key == itemDelete.key) {
            return {
              ...item,
              value: item?.value?.filter((v: any, vIndex: number) => vIndex != index)
            }
          } else {
            return item
          }
        })
        newItemDatas = newItemDatas.filter((nItem:any) => nItem.value && nItem.value.length > 0)
        await saveAfterChangePlaylist(newItemDatas)
        newItemDatas = newItemDatas.filter((item: any) => item?.value?.length > 0)
        setPlaylistItemData({ ...playlistItemData, playlistItem: newItemDatas })
        generateTracks(newItemDatas, playlistItemData.resTrack)
        if (trackIndex == playIndex) {
          clearAll()
        }
      } catch (error) {
        console.log("🚀 ~ handleDelItem ~ error:", error)
      }
    } else {
      // Handle the case when the user clicks "Cancel" or closes the dialog
      console.log('User clicked Cancel or closed the dialog. Action canceled.');
    }
  };

  // click change color heart icon
  const handleClickVote = async () => {
    const data = {
      playlist_id: playInforItem.id,
      vote: +!statusHeart,
    };
    await votePlayList(data);
    setStatusHeart(!statusHeart);
  };

  const handlePlaySelect = (event: any, index: number, item: any) => {
    event.stopPropagation()
    if (!item.lock) {
      audioPlayerRef.current.togglePlay(index)
    }
  };

  const handleDel = async () => {
    try {
      if (confirm('Are you sure you want to delete playlist!') === true) {
        const resDel = await deletePlayList(_playlistId);
        try {
          toast.success(resDel.data.rsp_msg);
          if (playlistId == _playlistId) {
            clearAll()
          }
          setTimeout(() => {
            navigate('/playlists_list');
          }, 500);
        } catch (error) {
          toast.error(resDel.data.rsp_msg);
        }
      }
    } catch (error) { }
  };
  const handleBack = () => {
    navigate(-1);
    setIsOpenNewPlaylist(false);
  };

  useEffect(() => {
    setPlayInforItem(currentPlaylistEdit);
  }, [currentPlaylistEdit]);

  useEffect(() => {
    const handleContextMenu = (e: any) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: any) => {
      if (e.keyCode == 123) {
        e.preventDefault();
      }
    };

    // Add event listeners when the component mounts
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // Clean up the event listeners when the component unmounts
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleCollapse = (key: any, isOpen: any, trackCollaps = tracks) => {
    setTracks(trackCollaps.map((item: any, _index) => {
      if (key == item.key) {
        return { ...item, isOpen }
      }
      return { ...item }
    }
    ))
  }

  const handleDelAllSection = async (event: any, item: any) => {
    event.stopPropagation()
    const userConfirmed = confirm('Are you sure you want to delete!');
    if (userConfirmed) {
      // Perform the action you want to do when the user confirms
      if (!item.lock) {
        try {
          const newItemDatas = playlistItemData.playlistItem.filter((_item: any) => _item.key != item.key)
          setPlaylistItemData({ ...playlistItemData, playlistItem: newItemDatas })
          generateTracks(newItemDatas, playlistItemData.resTrack)
          saveAfterChangePlaylist(newItemDatas)
          if (tracks.find((item: any, index: number) => index == playIndex)) {
            clearAll()
          }
        } catch (error) {
          console.log("🚀 ~ handleDelItem ~ error:", error)
        }
      }
    } else {
      // Handle the case when the user clicks "Cancel" or closes the dialog
      console.log('User clicked Cancel or closed the dialog. Action canceled.');
    }
  }

  const handleSelectSilent = (tier: string) => {
    setIsOpenSilentDropDown(false);
    navigate(`/silent-quantum?tier=${tier}`)
  };


  const SilentDropdown = () => {
    const items = [
      {
        id: 1,
        name: 'Silent Quantum',
        tier: 'normal'
      },
      {
        id: 1,
        name: 'Silent Quantum pro',
        tier: 'pro'
      },
    ]
    return (
      <NavigateDropdown
        buttonContent='Select Silent Quantum'
        items={items}
        isOpen={isOpenSilentDropDown}
        toggleModal={() => setIsOpenSilentDropDown(!isOpenSilentDropDown)}
        onClickItem={(item: any) => handleSelectSilent(item.tier)}
      />
    );
  };


  useEffect(() => {
    if (playlistId == _playlistId) {
      _setPlayIndex(playIndex)
    }
  }, [playIndex, isLoading, isPlay, tracks, playlistId])

  useEffect(() => {
    const checkLocked = !!tracks?.find((item: any) => item.lock == true);
    setIsLocked(checkLocked)
  }, [tracks])

  const handleChangeSeachInput = (e: any) => {
    if (e.target.value) {
      setSearchInput(e.target.value)
    }
  }

  const handleSearch = () => {
    if (searchInput) {
      navigate(`/popular_playlist_list?keyword=${searchInput}`)
    }
  }

  const changePrivatePlaylist = async (isChecked: any) => {
    const isPrivate = isChecked ? 0 : 1
    savePlayList({
      id: _playlistId,
      name: playInforItem.name,
      is_private: isPrivate,
    }).then((data) => {
      console.log(data)
    })
  }

  const handleFavorite = async (e: any) => {
    if (!isLogined()) {
      return navigate('/login');
    }
    e.stopPropagation()
    const is_favorite = playInforItem.is_favorite == 1 ? 0 : 1;
    const postData = {
      playlist_id: playInforItem.id,
      is_favorite: is_favorite
    }
    saveFavorite(postData).then(() => {
      setPlayInforItem({
        ...playInforItem,
        is_favorite: is_favorite
      })
    })
  }


  function swapKeys(data: any[], keyA: any, keyB: any) {
    const indexA = data.findIndex(item => item.key === keyA);
    const indexB = data.findIndex(item => item.key === keyB);
    if (indexA !== -1 && indexB !== -1) {
      const temp = data[indexA];
      data[indexA] = data[indexB];
      data[indexB] = temp;
    }
    return data;
  }


  const handleDragStart = (e: any, key: number) => {
    e.dataTransfer.effectAllowed = "move";

    // Serialize the necessary data as a JSON string
    const dragData = JSON.stringify({ key });
    e.dataTransfer.setData("application/json", dragData);

    // Check if the browser is iOS Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    // Conditionally set the drag image for non-iOS Safari browsers
    if (!isIOS) {
      const target = e.target as HTMLElement;
      if (target && target.parentNode) {
        const parentElement = target.parentNode as HTMLElement;
        const dragImage = parentElement.cloneNode(true) as HTMLElement;
        document.body.appendChild(dragImage);
        dragImage.style.position = "absolute";
        dragImage.style.top = "-999px";
        e.dataTransfer.setDragImage(dragImage, 20, 20);
        setTimeout(() => document.body.removeChild(dragImage), 0);
      }
    }
    setDraggedItemIndex(key);
  };


  // Handle when dragging over another item
  const handleDragOver = (e: any) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  // Handle when an item is dropped
  const handleDrop = (key: number) => {
    let newPlaylistItemData = swapKeys(playlistItemData.playlistItem, draggedItemIndex, key)
    setPlaylistItemData({ ...playlistItemData, playlistItem: newPlaylistItemData })
    saveAfterChangePlaylist(newPlaylistItemData)
    generateTracks(playlistItemData.playlistItem, playlistItemData.resTrack)
    setDraggedItemIndex(null);
    clearAll()
  };

  const handleTouchStart = (e: any, key: number) => {
    setDraggedItemIndex(key);
  };

  // Touch Move
  const handleTouchMove = (e: any) => {
    const touch = e.touches[0];
    const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
    if (targetElement) {
      const key = targetElement.getAttribute("data-key");
      if (key) {
        handleDrop(Number(key));
      }
    }
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
    clearAll()
  };

  // Touch End
  const handleTouchEnd = () => {
    setDraggedItemIndex(null);
  };


  const saveAfterChangePlaylist = (newPlaylistItemData: any) => {
    console.log(newPlaylistItemData)
    let isRemovePlaylistItem = newPlaylistItemData.length == 0 
    savePlayList({
      id: _playlistId,
      name: playInforItem.name,
      is_private: playInforItem.is_private,
      playlist_items: newPlaylistItemData,
      isRemovePlaylistItem
    }).then((data) => {
      console.log(data)
    })
  }

  const handleDuplicate = async (event: any, duplicateItem: any, itemIndex: number) => {
    event.stopPropagation()
    const userConfirmed = confirm('Do you really want to duplicate this item?');
    if (userConfirmed) {
      const duplicatedData = playlistItemData.playlistItem.reduce((acc: any, item: any) => {
        if (item.key === duplicateItem.key) {
          item.value = item.value.toSpliced(itemIndex + 1, 0, duplicateItem.id);
        }
        acc.push(item);
        return acc;
      }, []);
      setPlaylistItemData({ ...playlistItemData, playlistItem: duplicatedData })
      const newTracks = generateTracks(duplicatedData, playlistItemData.resTrack)
      await saveAfterChangePlaylist(duplicatedData)
      handleCollapse(duplicateItem.key, true, newTracks)
      clearAll()
      toast.success('Duplicate track success.')
    }
  }

  return (

    <div className="w-full mt-[80px] pb-[100px]">
      <Head title={playInforItem?.name || playInforItem?.title} />
      {loading ? (
        <>
          <LoadingButton />
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4 px-6">
            <div onClick={handleBack} className="border border-black p-1.5 rounded-md shadow-md cursor-pointer">
              <img className="object-cover " src={left} alt="" />
            </div>
            <form
              className="border border-[#9F9F9F] h-[34px] rounded-md md:w-2/3 lg:w-[calc(50%-24px)] flex items-center relative my-4"
              onSubmit={handleSearch}
            >
              <span className="ml-2">
                <SearchIcon w="20" h="20" />
              </span>
              <input
                type="text"
                className="font-light pl-2 w-full h-full bg-transparent border-none outline-none px-2 placeholder:text-black placeholder:font-medium"
                placeholder="Search..."
                value={searchInput}
                onChange={handleChangeSeachInput}
              />
              <button
                type="button"
                className="bg-[#409F83] text-white px-4 h-full rounded-md ml-2 hover:bg-[#367A61] focus:outline-none md:hidden"
                onClick={handleSearch}
              >
                Search
              </button>
            </form>
          </div>
          <div className="w-full flex flex-col lg:flex-row pt-4">
            <div className="w-full px-6 lg:w-1/2 float-left">
              <div className="flex flex-col mb-4 lg:mb-0 sm:flex-row ">
                <div className="relative sm:w-1/3">
                  <img
                    className="w-2/3 mx-auto sm:mb-0 mb-4 sm:w-full"
                    src={
                      cateoryId === ''
                        ? photoItem
                        : playInforItem.image === null
                          ? `${frequencyImage}`
                          : `${linkImage}/${playInforItem.id}/${playInforItem.image}`
                    }
                    alt="image"
                  />
                  {playInforItem.userid == userID && (
                    <div className='flex items-center justify-center mt-3'>
                      <Switcher
                        onText='PUBLIC'
                        offText='PRIVATE'
                        offColor="bg-[#9747FF]"
                        width='110px'
                        isChecked={playInforItem?.private == 0 ? true : false}
                        cb={changePrivatePlaylist}
                      />
                    </div>
                  )}
                  {playInforItem?.lock ? (
                    <FaLock size={30} color="white" className="absolute bottom-[5%] right-[10%] " />
                  ) : (
                    <></>
                  )}
                  {playInforItem.private == 1 && (
                    <svg
                      className="h-5 w-5 text-white absolute sm:right-5 right-5 bottom-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /> <circle cx="12" cy="7" r="4" />
                    </svg>
                  )}
                </div>
                <div className=" w-full sm:w-2/3 px-0 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h1 className="mr-2 text-xl font-medium w-full text-[#333] break-all block truncate overflow-hidden">
                      {cateoryId === '' ? playInforItem?.name : playInforItem.title}
                    </h1>
                    <div className='flex justify-center items-center gap-2'>
                      <svg onClick={handleClickVote} viewBox="0 0 16 18" fill={`${!statusHeart ? 'none' : '#409F83'}`} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${!statusHeart ? 'text-black' : 'text-[#0D9F8E]'
                        } duration-150 cursor-pointer`}>
                        <path d="M11.3557 6.68098C11.238 6.36703 14.4852 3.46745 12.5922 1.11728C12.15 0.567875 10.6455 3.74824 8.51087 5.18808C7.33302 5.98234 4.59207 7.67533 4.59207 8.60777V14.6584C4.59207 15.7827 8.93757 16.9727 12.2401 16.9727C13.4505 16.9727 15.2043 9.38821 15.2043 8.18438C15.2043 6.98056 11.4712 6.99603 11.3557 6.68098ZM3.70771 6.76499C3.34852 6.76015 2.99216 6.82917 2.66075 6.96779C2.32934 7.10641 2.02996 7.31166 1.78118 7.5708C1.5324 7.82995 1.33954 8.13745 1.21456 8.47424C1.08958 8.81102 1.03515 9.1699 1.05465 9.5286V13.8161C1.03519 14.1704 1.09036 14.5248 1.21657 14.8564C1.34279 15.1881 1.53724 15.4895 1.78733 15.7412C2.03743 15.9929 2.3376 16.1893 2.66841 16.3176C2.99922 16.446 3.35329 16.5034 3.70771 16.4863C4.28862 16.4863 2.82336 15.9805 2.82336 14.4876V8.84986C2.82336 7.28621 4.28862 6.76389 3.70771 6.76389V6.76499Z" stroke="currentColor" />
                      </svg>
                      <svg
                        onClick={handleFavorite}
                        className={`h-6 w-6 duration-150 cursor-pointer ${playInforItem.is_favorite == 1 ? 'text-[#0D9F8E]' : 'text-black'}`}
                        fill={`${playInforItem.is_favorite != 1 ? 'none' : '#409F83'}`}
                        viewBox="0 0 24 24"
                        stroke={`${playInforItem.is_favorite != 1 ? 'black' : '#409F83'}`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </div>

                  </div>

                  <p className="my-4 font-medium w-full break-all overflow-hidden line-clamp-6 text-justify">
                    {playInforItem?.description === null ? `  ` : playInforItem?.description}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full  h-full px-6 text-[#333] lg:w-1/2 float-left pb-5">
              <div className="bg-[#ECF5F4] rounded-md p-4 md:p-8">
                {
                  isShowAdvancedMode && <div className='mb-3'>
                    {SilentDropdown()}
                  </div>
                }
                <div className="bg-white rounded-md ">
                  <AudioPlayer
                    playlistId={_playlistId}
                    albumInfo={playInforItem}
                    ref={audioPlayerRef}
                    trackProps={tracks}
                    silent_scalars={silentScalarPlays}
                    frequencyId={playInforItem?.frequency_id}
                  />
                </div>
                <div className={` pt-4`}>
                  <div className="h-full max-h-[400px] overflow-y-auto py-2">
                    {statusTrack ? (
                      <>
                        <LoadingButton />
                      </>
                    ) : (
                      <>
                        {isLocked && (
                          <button className="bg-[#059F83] w-full text-[#e5e5e5] font-medium h-[50px] ">
                            <span className="font-semibold">This playlist includes locked frequencies</span>
                          </button>
                        )}
                        {tracks &&
                          Array.from(tracks).map((item: any, index: number) => {
                            return (
                              <div onDragOver={handleDragOver} onDrop={() => handleDrop(item.key)} >{!item.id ?
                                <div className={`drag-item cursor-pointer flex items-center drag ${draggedItemIndex == item.key ? 'dropArea' : ''} `}
                                  onDragStart={(e) => handleDragStart(e, item.key)}
                                  onTouchStart={(event) => handleTouchStart(event, index)}
                                  onTouchMove={handleTouchMove}
                                  onTouchEnd={handleTouchEnd}
                                  onDragEnd={handleDragEnd}
                                  draggable
                                >
                                  <div className='flex flex-1 border-b py-2'>
                                    <p
                                      className={`flex text-sm items-center gap-2 flex w-[100%] py-2 capitalize font-bold ${tracks[_playIndex] && tracks[_playIndex]
                                      ['key'] === tracks[index]
                                        ['key'] ? 'text-[#059F83]' : ''}`} onClick={() => handleCollapse(item.key, !item.isOpen)}>
                                      {playInforItem?.userid == userID && (
                                        <img src={Frame599} />)}
                                      <span>
                                        {!item.isOpen ? <FaPlus /> : <FaMinus />}
                                      </span>
                                      <span style={{ textTransform: 'capitalize' }} className='flex-grow'>{item.albumTitle}</span>
                                      <IoClose size={20} className="hover:opacity-90 duration-200 cursor-pointer" onClick={(e) => handleDelAllSection(e, item)} />
                                    </p>
                                  </div>
                                </div>
                                :
                                <div
                                  className={`transition-all duration-300 ${item.isOpen ? 'opacity-100 max-h-full' : 'opacity-0 max-h-0 overflow-hidden'}`}
                                  key={index}
                                  style={{ maxHeight: item.isOpen ? '1000px' : '0' }}
                                >
                                  <div className={`cursor-pointer flex items-center`}>
                                    <div className='flex-1 ml-1 pl-5'>
                                      <div
                                        className={`drag-item flex justify-between items-center transition: "all .2s" border-b border-gray py-2`}>
                                        <p onClick={(e) => handlePlaySelect(e, index, item)}
                                          className={`py-2 flex font-semibold items-center justify-between cursor-pointer hover:opacity-80 duration-100 ${_playIndex === index ? 'text-[#059F83]' : item.lock ? 'text-[#999]' : 'text-[#585858]'
                                            }`}
                                        >{item.lock && <FaLock className='mr-2' />}
                                          <span>{item.title}</span> </p>
                                        {playInforItem?.userid == userID &&
                                          <div className='flex justify-between items-center gap-2'>
                                            <img src={DuplicateIcon} onClick={(e) => handleDuplicate(e, item, index - item.keyIndex)} />
                                            <div onClick={(e) => handleDelItem(e, item, index - item.keyIndex, index)}>
                                              <IoClose size={20} className="hover:opacity-90 duration-200 cursor-pointer" />
                                            </div>
                                          </div>
                                        }
                                      </div>
                                    </div>
                                  </div>
                                </div>}
                              </div>
                            );
                          })}
                      </>
                    )}
                  </div>
                  <div className="flex justify-end mt-4">
                    {props.name == 'myplaylist' && <button
                      onClick={() => handleClickAddNewFrequency(playInforItem)}
                      className="bg-[#059F83] flex  items-center text-white py-[6px] px-[12px] h-[34px] rounded-md"
                    >
                      <MdOutlinePlaylistAdd size={'25'} />  &nbsp; Add more
                    </button>}
                  </div>
                </div>
              </div>
              {playInforItem.userid == userID && (
                <div className="flex items-center mt-7">
                  <button
                    onClick={() => handleClickEditPlaylists(playInforItem)}
                    className="py-[6px] px-[12px] h-[34px] mx-1 flex items-center border rounded-md text-[#333333] hover:bg-[#E6E6E6] duration-200 ease-linear"
                  >
                    <TiEdit />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDel()}
                    className="bg-[#F0AD4E] h-[34px] rounded-md py-[6px] px-[12px] flex items-center mx-1 text-white hover:opacity-90 duration-200 ease-linear"
                  >
                    <RiDeleteBin6Line />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      <ModalAddNewFrequency handleAdd={() => handleAdd()} playInforItem={playInforItem} />
    </div>
  );
};

export default PlaylistsItem;
function loadImage() {
  throw new Error('Function not implemented.');
}
