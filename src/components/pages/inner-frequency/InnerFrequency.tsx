import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import left from '~/assets/img/playlist/left.png';
import photoItem from '~/assets/img/custom_playlist.jpeg';
import DropdownButton from '~/components/shared/Dropdown/Dropdown';
import { AppContext } from '~/components/context/AppProvider';
import { getFrequencies } from '~/services/FrequencyServices';
import { FaLock } from 'react-icons/fa';
import { getTrack, getFrequencyDetail } from '~/services/InnerFrequenciesServices';
import frequencyImage from '~/assets/img/image/frequency.png';
import LoadingButton from '~/components/LoadingButton';
import ModalCreateNewPlaylist from '~/components/shared/modal/ModalCreateNewPlaylist';
import { getFavorites, saveFavorite } from '~/services/FavoritesServices';
import { checkLockAlbum, isLogined, getUnlockUrl } from '~/helpers/token';
import { useAudio } from '~/components/context/AudioProvider';
import AudioPlayer from '~/components/shared/Audio/AudioPlayer';
import NavigateDropdown from '~/components/shared/Dropdown/NavigateDropdown';
import { trackFacebookEvent, trackFacebookEventCustom } from '~/helpers/fbq';
import Head from '~/components/shared/UI/Head';
import SearchForm from '~/components/shared/UI/SearchForm';

const Item = (props: any) => {
  const { getMyPlaylist, setSearchInput, pathName } = useContext(AppContext);
  const {
    playIndex,
    playlistId,
    isPlay, isLoading, setIsPlayType, isShowAdvancedMode
  } = useAudio();
  const { dataMyPlaylist } = useContext(AppContext);

  const { search } = useLocation();

  const _playlistId = String(new URLSearchParams(search).get('id') ?? '');
  const cateoryId = String(new URLSearchParams(search).get('category') ?? '');
  const type = String(new URLSearchParams(search).get('type') ?? null);

  const navigate = useNavigate();
  const [isOpenPlayList, setOpenPlayList] = useState(false);
  const [num, setNum] = useState(0);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [playInforItem, setPlayInforItem] = useState<any>([]);
  const [statusHeart, setStatusHeart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tracks, setTracks] = useState([]);
  const linkImage = 'https://apiadmin.qienergy.ai/assets/uploads/mp3/';
  const audioPlayerRef = useRef(null);
  const [_playIndex, _setPlayIndex] = useState(null)
  const [isOpenSilentDropDown, setIsOpenSilentDropDown] = useState(false);
  const [isOpenMyPlaylistDropDown, setIsOpenMyPlaylistDropDown] = useState(false);
  const [unlockPageInfo, setUnlockPageInfo] = useState(null);

  const getDataPlayInforItem = async () => {
    try {
      if (cateoryId == "7" && !isLogined() && _playlistId != '5964') {
        return navigate('/register')
      }

      if (_playlistId && cateoryId !== '') {
        setLoading(true);
        const res = await getFrequencies('', [], '', '1', +_playlistId);
        const dataItem = res.data.frequencies[0]

        if (!dataItem?.id) {
          navigate('/not-found');
        } else {
          setPlayInforItem(dataItem);
          getMyFavoriteList(dataItem);
          getDataTracks(dataItem);
          setUnlockPageInfo(getUnlockUrl(dataItem))
        }
        setLoading(false);
        loadImage();
      }
    } catch (error) {
      setLoading(false);
    }
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    navigate(-1)
  };


  // get data mp3
  const getDataTracks = async (_playInforItem: any) => {
    try {
      if (cateoryId !== 'null' && cateoryId !== 'undefined' && cateoryId != '1') {
        const resTrack = await getTrack(`albumid=${_playlistId}`);
        setTracks(
          resTrack.data.tracks.map((item: any) => ({
            id: item.id,
            title: item.name,
            url: item.audio_file,
            lock: checkLockAlbum(_playInforItem),
            type: 'mp3',
          }))
        );

      } else {
        const resTrack = await getFrequencyDetail(_playlistId);
        if (!resTrack.data.frequencies[0]?.id) {
          return navigate('/not-found');
        }
        const frequencies = resTrack.data.frequencies[0].frequencies;
        const statusLock = resTrack.data.frequencies[0].lock;
        const tracks = frequencies.split('/').map((item: any) => ({
          id: +item,
          title: `${item} Hz`,
          url: +item,
          lock: statusLock,
          type: 'rife',
        }));
        setTracks(tracks);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataPlayInforItem();
    scrollToTop();
    getMyPlaylist();
  }, [_playlistId]);

  useEffect(() => {
    setIsPlayType('single')

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

  const getMyFavoriteList = async (playInforItem: any) => {
    getFavorites().then(({ data }: any) => {
      if (data?.favorite?.length > 0) {
        if (
          data.favorite.find(
            (item: any) => item.type == 'album' && playInforItem.id == item.id && !!playInforItem.categoryId
          )
        ) {
          setStatusHeart(true);
        }
        if (
          data.favorite.find(
            (item: any) => item.type == 'rife' && playInforItem.id == item.id && !playInforItem.categoryId
          )
        ) {
          setStatusHeart(true);
        }
      }
    });
  };

  const handleModalItem = (id: number) => {
    if (num === id) {
      setOpenPlayList(false);
      setNum(0);
    } else {
      setOpenPlayList(true);
      setNum(id);
    }
  };

  const dropdownItems = [
    { label: 'Dashboard', href: '#' },
    { label: 'Settings', href: '#' },
    { label: 'Earnings', href: '#' },
  ];
  // click change color heart icon
  const handleClickHeart = async () => {
    if (!isLogined()) {
      navigate('/login');
    }
    const data = { albumid: '', frequency_id: '', is_favorite: !statusHeart ? 1 : 0 };
    data.albumid = playInforItem.id;
    data.frequency_id = playInforItem.id;
    if (playInforItem?.categoryId) {
      delete data.frequency_id;
    } else {
      delete data.albumid;
    }
    const res = await saveFavorite(data);
    setStatusHeart(!statusHeart);
  };

  const handlePlaySelect = (index: number, item: any) => {
    if (!checkLockAlbum(playInforItem)) {
      audioPlayerRef.current.togglePlay(index)
    }
  };

  // search method....
  const handleEnterSearch = async (searchValue: any) => {
    if (searchValue) {
      navigate(`/search?keyword=${searchValue}`);
    }
  };

  const handleSearch = async (value: string) => {
    handleEnterSearch(value);
  };

  const handleUnlock = () => {
    // trackFacebookEventCustom('purchase_click', {
    //   content_name: unlockPageInfo.text
    // })

    if (!isLogined()) {
      return navigate('/login');
    }

    if(!unlockPageInfo){
      return navigate('/not-found-subscription')
    }
    window.location.href = unlockPageInfo.url
  };

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

  const renderMyPlayListDropdow = () => {
    return (
      <NavigateDropdown
        buttonContent='Go to Playlist'
        items={dataMyPlaylist}
        isOpen={isOpenMyPlaylistDropDown}
        toggleModal={() => setIsOpenMyPlaylistDropDown(!isOpenMyPlaylistDropDown)}
        onClickItem={(item: any) => navigate(`/playlists?id=${item.id}`)}
      />
    );
  }

  useEffect(() => {
    if (playlistId == `${_playlistId}-${cateoryId}`) {
      _setPlayIndex(playIndex)
    }
  }, [playIndex, isLoading, isPlay, tracks, playlistId])

  return (
    <div className="w-full pb-[50px]">
      <Head title={playInforItem?.name || playInforItem?.title} />
      {loading ? (
        <>
          <LoadingButton />
        </>
      ) : (
        <>
          <div className="md:flex items-center justify-between mb-4 px-6">
            {type != 'recommend' ? <div onClick={handleBack} className="border border-black p-1.5 rounded-md shadow-md cursor-pointer w-[30px]  mb-2">
              <img className="object-cover" src={left} alt="" />
            </div> : <div />}
            <div className='lg:w-[calc(50%-24px)] '>
              <SearchForm onSearch={handleSearch} />
            </div>
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
                  {checkLockAlbum(playInforItem) ? (
                    <FaLock
                      size={30}
                      color="white"
                      className="absolute bottom-[10%] right-[18%] sm:right-[5%]  sm:bottom-[5%] "
                    />
                  ) : (
                    <></>
                  )}
                </div>
                <div className=" w-full sm:w-2/3 px-0 sm:px-6">
                  <div className="flex items-start justify-between mb-4">
                    <h1 className="text-xl font-medium text-[#333]">
                      {cateoryId === '' ? playInforItem?.name : playInforItem.title}
                    </h1>
                    <div>
                      <svg
                        onClick={handleClickHeart}
                        className={`h-6 w-6 duration-150 cursor-pointer ${statusHeart ? 'text-[#0D9F8E]' : 'text-black'}`}
                        fill={`${!statusHeart ? 'none' : '#409F83'}`}
                        viewBox="0 0 24 24"
                        stroke={`${!statusHeart ? 'black' : '#409F83'}`}
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

                  <p className="font-medium ">
                    {playInforItem?.description === 'null' ? '' : playInforItem?.description}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full px-6 text-[#333] lg:w-1/2 float-left pb-5">
              <div className="rounded-md p-4 md:p-8">
                <div className={`mb-2 ${isShowAdvancedMode ? 'flex justify-between flex-wrap gap-2 ' : 'text-right '}`}>
                  {
                    isShowAdvancedMode && SilentDropdown()
                  }
                  <div className='flex gap-2 justify-end items-start'>
                    {renderMyPlayListDropdow()}
                    <div className='flex justify-end gap-2'>
                      <DropdownButton
                        id="0"
                        items={dropdownItems}
                        trackList={tracks}
                        albumId={playInforItem.id}
                        albumTitle={playInforItem.title}
                        buttonContent={
                          <>
                            <span>Add to Playlist </span>
                            <svg
                              className="w-2.5 h-2.5 ms-3 ml-1"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 10 6"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 1 4 4 4-4"
                              />
                            </svg>
                          </>
                        }
                        background="bg-[#059f83] hover:bg-[#166e5e]"
                        placement="dropdown"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-md">
                  <AudioPlayer
                    playlistId={`${_playlistId}-${cateoryId}`}
                    albumInfo={playInforItem}
                    ref={audioPlayerRef}
                    trackProps={tracks}
                    currentIndex={currentAudioIndex}
                    frequencyId={playInforItem?.frequency_id}
                    isLocked={checkLockAlbum(playInforItem)}
                  />
                </div>
                <div className={`  pt-4`}>
                  {checkLockAlbum(playInforItem) ? (
                    <>
                      <button onClick={handleUnlock} className="bg-[#059F83] w-full text-[#e5e5e5] font-medium h-[50px] ">
                        <span className="font-semibold">{unlockPageInfo?.text}</span>
                      </button>
                    </>
                  ) : (
                    <></>
                  )}
                  <div className="h-full py-2 relative">
                    {tracks ?
                      Array.from(tracks).map((item: any, index: number) => {
                        return (
                          <div key={index} className="drag-item py-2 border-b border-gray flex items-center justify-between">
                            <h2
                              onClick={() => handlePlaySelect(index, item)}
                              className={`font-semibold ${_playIndex === index ? 'text-[#059F83]' : 'text-black'
                                } cursor-pointer hover:opacity-80 duration-100 `}
                            >
                              {item.title}
                            </h2>
                            <div onClick={() => handleModalItem(index)} className="relative">
                              <DropdownButton
                                id={`${index + 1}`}
                                items={dropdownItems}
                                albumTitle={playInforItem.title}
                                albumId={playInforItem.id}
                                trackList={[item]}
                                buttonContent={
                                  <svg
                                    className={`${isOpenPlayList ? 'relative' : ''} h-5 w-5 text-black cursor-pointer`}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <circle cx="12" cy="12" r="1" /> <circle cx="12" cy="5" r="1" />{' '}
                                    <circle cx="12" cy="19" r="1" />
                                  </svg>
                                }
                                placement="left"
                                background="bg-transparent"
                                className='bottom-[10px]'
                              />
                            </div>
                          </div>
                        );
                      }) : <div />}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ModalCreateNewPlaylist />
        </>
      )}
    </div>
  );
};

export default Item;
function loadImage() {
  throw new Error('Function not implemented.');
}
