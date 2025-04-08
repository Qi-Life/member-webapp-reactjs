import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import SearchIcon from '~/components/shared/Icons/SearchIcon';
import left from '~/assets/img/playlist/left.png';
import { AuthContext } from '~/components/context/AppProvider';
import { FaLock, FaPlus } from 'react-icons/fa';
import frequencyImage from '~/assets/img/image/frequency.png';
import LoadingButton from '~/components/LoadingButton';
import { getUnlockUrl, isLogined } from '~/helpers/token';
import { deleteCustomFrequencies, getCustomFrequenciesDetail, updateCustomFrequencies } from '~/services/CustomFrequencyServices';
import AddCustomFrequencyModal from './AddCustomFrequencyModal';
import { TiEdit } from 'react-icons/ti';
import { RiDeleteBin2Line } from 'react-icons/ri';
import EditCustomFrequencyModal from './EditCustomFrequencyModal';
import { IoClose } from 'react-icons/io5';
import { toast } from 'react-toastify';
import AudioPlayer from '~/components/shared/Audio/AudioPlayer';
import { trackFacebookEvent, trackFacebookEventCustom } from '~/helpers/fbq';

const CustomFrequenciesDetail = (props: any) => {
  const { getMyPlaylist, setSearchInput } = useContext(AuthContext);
  const search = useLocation().search;
  const playlistId = String(new URLSearchParams(search).get('id') ?? '');
  const cateoryId = String(new URLSearchParams(search).get('category') ?? '');
  const [, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [playInforItem, setPlayInforItem] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [tracks, setTracks] = useState([]);
  const audioPlayerRef = useRef(null);
  const [isOpenNewFrequency, setIsOpenNewFrequency] = useState(false);
  const [isOpenEditFrequency, setIsOpenEditFrequency] = useState(false);
  const [unlockPageInfo, setUnlockPageInfo] = useState(null);
  
  const getDataPlayInforItem = async () => {
    try {
      if (playlistId && cateoryId !== '') {
        setLoading(true);
        const res = await getCustomFrequenciesDetail(playlistId);
        if (res.data.frequencies?.fetch_flag === -1) {
          setPlayInforItem([]);
        } else {
          setPlayInforItem(res.data);
          setUnlockPageInfo(getUnlockUrl(res.data))
          const frequencies = res.data.frequencies;
          const tracks = frequencies
            .split('/')
            .filter((item: any) => item != '')
            .map((item: any) => ({
              id: +item,
              title: `${item} Hz`,
              url: +item,
              lock: false,
              type: 'rife',
            }));
          setTracks(tracks);
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

  useEffect(() => {
    getDataPlayInforItem();
    scrollToTop();
    getMyPlaylist();
  }, []);

  const handlePlaySelect = (index: number, item: any) => {
    if (!item.lock) {
      setCurrentAudioIndex(index);
      audioPlayerRef.current.togglePlay(true, index);
    }
  };

  const updateAudioIndex = (index: number) => {
    setCurrentAudioIndex(index);
  };

  const handleEnterSearch = async (searchValue: any) => {
    if (searchValue) {
      navigate(`/search?keyword=${searchValue}`);
    }
  };

  const handleChange = (e: any) => {
    if (e.target.value === '') {
      handleEnterSearch(e.target.value);
      setSearchParams('');
    } else {
    }
    setSearchInput(e.target.value);
  };

  const handleSearch = async (e: any) => {
    if ((e.key === 'Enter' || e.code === 'Enter') && e.currentTarget.value.trim() !== '') {
      handleEnterSearch(e.target.value);
    }
  };

  const handleUnlock = () => {
    trackFacebookEventCustom('purchase_click', {
      content_name: unlockPageInfo.text
    })
    if (!isLogined()) {
      return navigate('/login');
    }

    if (!unlockPageInfo) {
      return navigate('/not-found-subscription')
    }

    if (unlockPageInfo?.out) {
      window.location.href = unlockPageInfo.url
    } else {
      navigate(unlockPageInfo.url, {
        state: { gobackUrl: window.location.href.replace(window.location.origin, '') },
      })
    }
  };

  const handleAddCustomFrequency = () => {
    setIsOpenNewFrequency(true);
  };

  const handleClickClose = () => {
    setIsOpenNewFrequency(false);
  };

  const handleOverlayClick = (e: any) => {
    if (e.target === e.currentTarget) {
      handleClickClose();
    }
  };

  const handleAddFrequencySuccess = (item: any) => {
    setTracks([
      ...tracks,
      {
        id: +item,
        title: `${item} Hz`,
        url: +item,
        lock: false,
        type: 'rife',
      },
    ]);
  };

  const onDeleteTrackSuccess = (newTracks: any) => {
    setTracks(newTracks);
    setPlayInforItem({ ...playInforItem, frequencies: newTracks.map((item: any) => item.id).join('/') });
  };

  const handleShowEditFrequency = () => {
    setIsOpenEditFrequency(true);
  };

  const handleDelFrequency = async () => {
    try {
      if (confirm('Do you want to delete this custom frequencies ?') === true) {
        await deleteCustomFrequencies(playInforItem.id);
        toast.success('Delete frequency success')
        setTimeout(() => {
          navigate('/custom-frequencies');
        }, 1000);
      }
    } catch (error) {
      toast.error('Delete frequency error')
    }
  };

  const handleEditModalClickClose = () => {
    setIsOpenEditFrequency(false);
  };

  const handleEditModalOverlayClick = (e: any) => {
    if (e.target === e.currentTarget) {
      handleEditModalClickClose();
    }
  };

  const handleEditModalFrequencySuccess = (item: any) => {
    setPlayInforItem({
      ...playInforItem,
      ...item,
    });
  };

  const handleDeleteTrack = async (item: any, index: number) => {
    try {
      if (confirm('Do you want to delete this custom frequencies ?') === true) {
        const newTrack = tracks.filter((_: any, _index: number) => _index != index);
        await updateCustomFrequencies({
          id: playInforItem.id,
          frequencies: newTrack.map((item: any) => item.id).join('/'),
        });
        onDeleteTrackSuccess(newTrack);
        toast.success('Delete custom frequency success');
        audioPlayerRef.current.handleDeleteTrack(index);
      }
    } catch (error) {
      toast.error('Delete error');
    }
  };

  return (
    <div className="w-full mt-[80px]">
      {loading ? (
        <>
          <LoadingButton />
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4 px-6">
            <div onClick={() => navigate(-1)} className="border border-black p-1.5 rounded-md shadow-md cursor-pointer">
              <img className="object-cover" src={left} alt="" />
            </div>
            <div className="border border-[#9F9F9F] h-[34px] rounded-md w-2/3  lg:w-[calc(50%-24px)] flex items-center relative my-4 ">
              <span className="ml-2">
                <SearchIcon w="20" h="20" />
              </span>
              <input
                type="text"
                className=" font-light absolute left-0 pl-10  w-full h-full bg-transparent border-none outline-none  px-2 placeholder:text-black placeholder:font-medium  "
                placeholder="Search..."
                onChange={(e) => handleChange(e)}
                onKeyDown={handleSearch}
              />
            </div>
          </div>
          <div className="w-full flex flex-col lg:flex-row pt-4">
            <div className="w-full px-6 lg:w-1/2 float-left">
              <div className="flex flex-col mb-4 lg:mb-0 sm:flex-row ">
                <div className="relative sm:w-1/3">
                  <img className="w-2/3 mx-auto sm:mb-0 mb-4 sm:w-full" src={frequencyImage} alt="image" />
                </div>
                <div className=" w-full sm:w-2/3 px-0 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-[#333] mb-2">{playInforItem.name}</h1>
                  </div>

                  <p className="font-medium ">
                    {playInforItem?.description === 'null' ? '' : playInforItem?.description}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full px-6 text-[#333] lg:w-1/2 float-left pb-5">
              <div className="bg-[#ECF5F4] rounded-md p-4 md:p-8">
                <div className="bg-white rounded-md">
                  <AudioPlayer
                    albumInfo={playInforItem}
                    ref={audioPlayerRef}
                    trackProps={tracks}
                    currentIndex={currentAudioIndex}
                    updateIndex={updateAudioIndex}
                    frequencyId={playInforItem?.frequency_id}
                  />
                  {playInforItem?.lock ? (
                    <>
                      <div className=" absolute top-0 h-full w-full bg-[#100d0d6e]  flex justify-center items-center">
                        <FaLock size={40} color="white" className="z-10 " />
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <div className={`  pt-4`}>
                  {playInforItem?.lock ? (
                    <>
                      <button onClick={handleUnlock} className="bg-[#059F83] w-full text-[#e5e5e5] font-medium h-[50px] ">
                        <span className="font-semibold">UNLOCK</span>
                      </button>
                    </>
                  ) : (
                    <></>
                  )}
                  <div className="h-full max-h-[300px] overflow-y-auto py-2">
                    {tracks &&
                      Array.from(tracks).map((item: any, index: number) => {
                        return (
                          <div
                            key={index}
                            className="py-2 border-b border-gray flex items-center justify-between relative"
                          >
                            <h1
                              onClick={() => handlePlaySelect(index, item)}
                              className={`font-semibold ${currentAudioIndex === index ? 'text-[#059F83]' : 'text-black'
                                } cursor-pointer hover:opacity-80 duration-100 `}
                            >
                              {item.title}
                            </h1>
                            <div onClick={() => handleDeleteTrack(item, index)}>
                              <IoClose size={25} className="hover:opacity-90 duration-200 cursor-pointer" />
                            </div>
                            {/* <div onClick={() => handleModalItem(index)}>
                              <DropdownItem
                                index={index}
                                tracks={tracks}
                                frequencyDetail={playInforItem}
                                onDeleteTrackSuccess={onDeleteTrackSuccess}
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
                                    {' '}
                                    <circle cx="12" cy="12" r="1" /> <circle cx="12" cy="5" r="1" />{' '}
                                    <circle cx="12" cy="19" r="1" />
                                  </svg>
                                }
                                placement="left"
                                background="bg-transparent"
                              />
                            </div> */}
                          </div>
                        );
                      })}
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => handleAddCustomFrequency()}
                      className="bg-[#059F83] flex  items-center text-white py-[6px] px-[12px] h-[34px] rounded-md"
                    >
                      <FaPlus className="mr-1" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center mt-7">
                <button
                  onClick={() => handleShowEditFrequency()}
                  className="py-[6px] px-[12px] h-[34px] mx-1 flex items-center border rounded-md text-[#333333] hover:bg-[#E6E6E6] duration-200 ease-linear"
                >
                  <TiEdit />
                  Edit
                </button>
                <button
                  onClick={() => handleDelFrequency()}
                  className="bg-[#F0AD4E] h-[34px] rounded-md py-[6px] px-[12px] flex items-center mx-1 text-white hover:opacity-90 duration-200 ease-linear"
                >
                  <RiDeleteBin2Line />
                  Delete
                </button>
              </div>
            </div>
          </div>
          <AddCustomFrequencyModal
            frequencyDetail={playInforItem}
            isOpenNewFrequency={isOpenNewFrequency}
            handleClickClose={handleClickClose}
            handleOverlayClick={handleOverlayClick}
            handleAddFrequencySuccess={handleAddFrequencySuccess}
          />
          <EditCustomFrequencyModal
            frequencyDetail={playInforItem}
            isOpenEditFrequency={isOpenEditFrequency}
            handleClickClose={handleEditModalClickClose}
            handleOverlayClick={handleEditModalOverlayClick}
            handleEditFrequencySuccess={handleEditModalFrequencySuccess}
          />
        </>
      )}
    </div>
  );
};

export default CustomFrequenciesDetail;

function loadImage() {
  throw new Error('Function not implemented.');
}
