import React, { forwardRef, useContext, useEffect, useState } from 'react';

import playIcon from '~/assets/img/playlist/middle.png';
import loadingIcon from '~/assets/img/playlist/loading.svg';
import nextIcon from '~/assets/img/playlist/forward.png';
import pauseIcon from '~/assets/img/playlist/mute.png';
import playOffIcon from '~/assets/img/play_off.png';
import nextOffIcon from '~/assets/img/play_next_off.png';
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
import suffOnIcon from '~/assets/img/playlist/shuffle_on.png';
import suffOffIcon from '~/assets/img/playlist/shuffle_off.png';

import siIcon from '~/assets/img/btn-sine-on.png';
import sqIcon from '~/assets/img/btn-sq-on.png';
import { useAudio } from '~/components/context/AudioProvider';
import ListItemAnimation from '../ListItem/ListItemAnimation';
import AudioMultiPlayer from './AudioMultiPlayer';
import ListItemAnimationMobile from '../ListItem/ListItemAnimationMobile';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '~/components/context/AppProvider';
import { isLogined } from '~/helpers/token';
import Button from '../UI/Button';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
    audioGL: any;
    google: any;
    googleTranslateElementInit: any;
  }
}

const AudioPlayerMini = forwardRef((props: any, ref: any) => {
  const {
    playlistId,
    playIndex,
    playlists,
    isPlay,
    progress,
    totalTime,
    formatTime,
    isLoading,
    playRepeat,
    wave,
    setIsPlay,
    changeRepeat,
    handleChangeWave,
    playNext,
    silentScalars,
    isPlayScalar, togglePlayScalar,
    playlistTitle,
    isShowAdvancedMode,
    isPlayWithSuff,
    handlePlayWithSuff
  } = useAudio();


  const { isPremium } = useContext(AppContext);
  const [isShowMiniPath, setShowMiniPath] = useState(false)
  const [isShowScalar, setIsShowScalar] = useState(false)

  let path = window.location.pathname;
  const navigate = useNavigate()

  const handlePlaySclar = () => {
    if (silentScalars.length == 0) {
      const currentTime = + new Date();
      navigate(`/silent-quantum?time=${currentTime}`)
    } else {
      togglePlayScalar()
    }
  }

  const renderRepeatButton = () => {
    let buttonText = playRepeat == 0 ? 'Repeat OFF' : playRepeat == 1 ? 'Repeat ONE' : 'Repeat ALL'
    let className = playRepeat != 0 ? 'text-[#059F83]' : 'text-[#808080]'
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          changeRepeat()
        }}
        className={`hover:opacity-80 duration-150 bg-[#fff] border-[2px] border-[#A5D4D8] rounded-[18px] px-2 py-[5px] w-[110px] font-semibold text-[13px] ${className}`}>{buttonText}</button>
    )
  }

  const handleClickFull = () => {
    if (!playlistId) return;
    if (playlistId?.includes('-')) {
      let playlistIds = playlistId.split('-')
      navigate(`/inner_frequencies?id=${playlistIds[0]}&category=${playlistIds[1]}`)
    } else if (playlistId && playlists?.length > 0) {
      navigate(`/playlists?id=${playlistId}`)
    }
  }

  const handleOpenScalar = () => {
    setIsShowScalar(!isShowScalar)
  }

  const onClickPlayWithSuff = (e: any) => {
    e.stopPropagation()
    handlePlayWithSuff()
  }

  const playSuffButton = () => {
    return (<>
      {
        isPlayWithSuff ? <img
          onClick={onClickPlayWithSuff}
          className="hover:cursor-pointer w-[33px] h-[33px] hover:opacity-80 duration-150"
          src={suffOffIcon}
          alt=""
        /> : <img
          onClick={onClickPlayWithSuff}
          className="hover:cursor-pointer w-[33px] h-[33px]  hover:opacity-80 duration-150"
          src={suffOnIcon}
          alt=""
        />
      }
    </>)
  }

  const renderPlayOffView = () => (
    <div className="flex flex-col justify-center grow px-5">
      <div className="flex items-center justify-center gap-1 sm:gap-3 mb-2">
        <>
          <img
            className="hover:cursor-pointer w-[33px] h-[33px]  hover:opacity-80 duration-150"
            src={suffOffIcon}
            alt=""
          />
          <img
            className={` hover:cursor-pointer w-10 h-10 hover:opacity-80 duration-150 ${isPlay ? 'hidden' : 'block'
              }`}
            src={playOffIcon}
            alt=""
          />
          <img
            className={` hover:cursor-pointer w-10 h-10 hover:opacity-80 duration-150 ${!isPlay ? 'hidden' : 'block'
              }`}
            src={pauseIcon}
            alt=""
          />
        </>
        <img
          className="hover:cursor-pointer w-[33px] h-[33px] hover:opacity-80 duration-150"
          src={nextOffIcon}
          alt=""
        />
        <button onClick={changeRepeat} className={`bg-[#fff] border-[2px] border-[#A5D4D8] rounded-[18px] px-2 py-[5px] w-[110px] font-semibold text-[13px] text-[#808080]`}>Repeat</button>
        {typeof playlists[playIndex]?.url == 'number' && (
          <button
            type="button"
            onClick={handleChangeWave}
            className="w-[33px] h-[33px] rounded-full font-medium"
          >
            <img src={wave === "sine" ? siIcon : sqIcon} />
          </button>
        )}
      </div>
      <div className="relative flex justify-between items-center gap-3 max-w-[800px] w-[90%] self-center">
        <span className='' >{formatTime(progress)}</span>
        <div className='w-full h-2 bg-gray-200 px-2 rounded-lg' />
        <div className='' >
          <span>{formatTime(0)}</span>
        </div>
      </div>
    </div>
  )

  const handlePlayAudio = (e: any, status: boolean) => {
    e.stopPropagation();
    if(playlists.length > 0){
      setIsPlay(status)
    }else{
      navigate('/starter-frequencies')
    }
  }

  useEffect(() => {
    setShowMiniPath(!['/login', '/payment', '/tutorials', '/video'].includes(path))
  }, [path])

  return (
    <>
      {
        (playlists?.length || (isShowAdvancedMode && isLogined())) &&
        <div style={{ zIndex: 20 }} className='relative'>
          <div className={`playmini-destop fixed bottom-0 left-0 right-0 bg-gray-800 w-full md:h-[100px]  transition-all duration-300 transform ${isShowMiniPath ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'} flex justify-between items-center`}>
            <div className='play-audio-minibar h-full grow' onClick={handleClickFull}>
              <div className={`p-3 text-[#fff]`}>
                {
                  playlists?.length > 0 ?
                    <>
                      <div className="flex justify-between items-center gap-5">
                        <div className='w-1/4 text-center cursor-pointer'>
                          <p className='mb-2 line-clamp-1 overflow-hidden ...'>{playlistTitle?.toUpperCase()}</p>
                          {
                            playlists[playIndex]?.id != null && <div className="font-semibold break-allline-clamp-2 overflow-hidden ...">
                              <span className="overflow-hidden text-[#059F83] cursor-pointer">
                                {playlists[playIndex]?.title?.toString()}
                              </span>
                            </div>
                          }
                        </div>
                        <div className="flex flex-col justify-center grow px-5">
                          <div className="flex items-center justify-center gap-1 sm:gap-3 mb-2">
                            {playSuffButton()}
                            {isLoading ? (
                              <>
                                <img
                                  className={` hover:cursor-pointer w-10 h-10 block hover:opacity-80 duration-150 `}
                                  src={loadingIcon}
                                  alt=""
                                />
                              </>
                            ) : (
                              <>
                                {!isPlay ?
                                  <img
                                    onClick={(e) => handlePlayAudio(e, true)}
                                    className={` hover:cursor-pointer w-10 h-10 hover:opacity-80 duration-150 }`}
                                    src={playIcon}
                                    alt=""
                                  /> :
                                  <img
                                    onClick={(e) => handlePlayAudio(e, false)}
                                    className={` hover:cursor-pointer w-10 h-10 hover:opacity-80 duration-150}`}
                                    src={pauseIcon}
                                    alt=""
                                  />
                                }
                              </>
                            )}
                            <img
                              onClick={(e) => {
                                e.stopPropagation();
                                playNext()
                              }}
                              className="hover:cursor-pointer w-[33px] h-[33px] hover:opacity-80 duration-150"
                              src={nextIcon}
                              alt=""
                            />
                            {renderRepeatButton()}
                            {typeof playlists[playIndex]?.url == 'number' && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleChangeWave()
                                }}
                                className="w-[33px] h-[33px] rounded-full font-medium"
                              >
                                <img src={wave === "sine" ? siIcon : sqIcon} />
                              </button>
                            )}
                          </div>
                          <div className="relative text-center max-w-[800px] w-[90%] self-center">
                            <span className='absolute top-[1px] left-[-38px]' >{formatTime(progress)}</span>
                            <input
                              className="rounded-lg overflow-hidden appearance-none bg-gray-200 h-2 ease-linear duration-300 w-full px-2"
                              type="range"
                              min="0"
                              max={totalTime}
                              step="1"
                              value={progress}
                            />
                            <div className='absolute  top-[1px] right-[-38px]' >
                              {totalTime ? <span>{formatTime(totalTime)}</span> : <img
                                className={`w-8 h-8 hover:opacity-80 duration-150`}
                                src={loadingIcon}
                                alt=""
                              />}
                            </div>
                          </div>
                        </div>
                      </div>
                    </> :
                    <>
                      <div className="flex justify-between items-center gap-5">
                        <div className='flex items-center text-base font-semibold'><span className='text-white'>Please choose a Frequency to Play</span></div>
                        {renderPlayOffView()}
                      </div>
                    </>
                }
              </div>
            </div>
            {isShowAdvancedMode && isPremium &&
              <div className='play-scalar-minibar bg-[#007660] self-stretch flex items-center p-4 lg:gap-5 xs:gap-2' style={{ minWidth: 'max-content' }}>
                {
                  isPlayScalar ?
                    < >
                      <Button textColor='text-[#409F83]' className="bg-[#ECF5F4] h-[50px] rounded-[30px] hover:bg-[#fff] md:text-[16px] text-semibold text-center whitespace-nowrap text-[#409F83]" onClick={handlePlaySclar}>Silent Quantum On</Button>
                      <span className="relative flex h-4 w-4 flex items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#409F83] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#409F83]"></span>
                      </span>
                      <div className='lg:w-[250px]'>
                        <ListItemAnimation items={silentScalars || []} />
                      </div>
                    </> :
                    <>
                      <Button textColor='text-[#808080]' className="bg-[#ECF5F4] h-[50px] rounded-[30px] hover:bg-[#fff] md:text-[16px] text-semibold text-center whitespace-nowrap" onClick={handlePlaySclar}>Silent Quantum Off</Button>
                      <div className='h-4 w-4  circle bg-[#409F83] rounded-full flex items-center justify-center bg-opacity-20'>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#409F83] bg-opacity-15"></span>
                      </div>
                      <span className='text-white lg:w-[250px]'>Silent Quantum is current turned off.</span>
                    </>
                }
              </div>}
            <AudioMultiPlayer sources={silentScalars} />
          </div>

          <div className={`playmini-mobile hidden fixed bottom-0 left-0 right-0 w-full transition-all duration-300 transform ${isShowMiniPath ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}>
            {
              isShowScalar ?
                <div onClick={(e: any) => {
                  handleOpenScalar()
                }} >
                  {isPlayScalar ? <div className='h-[88px] bg-[#007660] flex justify-between items-center rounded-t-2xl px-4' >
                    <ListItemAnimationMobile items={silentScalars || []} />
                    <Button textColor='text-[#409F83]' className="bg-[#ECF5F4] rounded-[30px] hover:bg-[#fff] font-semibold text-[12px] text-[#409F83]" onClick={(e: any) => {
                      e.stopPropagation()
                      handlePlaySclar()
                    }}>Silent Quantum On</Button>
                  </div> :
                    <div className='h-[88px] bg-[#007660] flex justify-center items-center rounded-t-2xl px-4' >
                      <Button onClick={(e: any) => {
                        e.stopPropagation()
                        handlePlaySclar()
                      }} textColor='text-[#000]' className="bg-[#ECF5F4] rounded-[30px] hover:bg-[#fff] md:text-[16px] text-semibold text-center whitespace-nowrap ">Silent Quantum Off</Button>
                    </div>
                  }
                </div> :
                <>
                  {
                    isShowAdvancedMode && isPremium &&
                    <div className='bg-[#007660] flex justify-center rounded-t-xl'>
                      <div className='relative h-[10px]'>
                        <div onClick={handleOpenScalar} className='absolute top-[-24px] left-1/2 transform -translate-x-1/2 
                                flex justify-center items-center gap-2
                                h-[25px] bg-[#007660] text-white rounded-t-2xl w-[150px] font-semibold text-[12px]'>
                          {
                            isPlayScalar ?
                              <div className='flex gap-2 items-center justify-center'>
                                <span className="relative flex h-4 w-4 flex items-center justify-center">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#409F83] opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#409F83]"></span>
                                </span>
                                Silent Quantum ON
                              </div> :
                              <div className='flex gap-2 items-center justify-center'>
                                <div className='rounded-full bg-[#ECF5F4] w-[9px] h-[9px] border-[2px] border-[#99c8bf]'>
                                </div>Silent Quantum OFF
                              </div>
                          }

                        </div>
                      </div>
                    </div>
                  }
                </>
            }

            {
              playlists?.length > 0 ?
                <div className='bg-black px-[10px] flex flex-col'>
                  <div className="flex justify-between items-center py-[20px]" onClick={handleClickFull}>
                    <div>
                      <p className='text-white mb-1 line-clamp-1 overflow-hidden ...'>{playlistTitle?.toUpperCase()}</p>
                      {
                        <div className="font-semibold break-all line-clamp-2 overflow-hidden ...">
                          <span className="overflow-hidden text-[#059F83] text-[12px]">
                            {playlists[playIndex]?.title?.toString()}
                          </span>
                        </div>
                      }
                    </div>
                    <div className="flex justify-center w-1/4">
                      {isLoading ? (
                        <>
                          <img
                            className={`hover:cursor-pointer  block hover:opacity-80 duration-150 w-[50px]`}
                            src={loadingIcon}
                            alt=""
                          />
                        </>
                      ) : (
                        <>
                          {
                            !isPlay ?
                              <FaPlay className='w-[25px] h-[32px]' color='white' onClick={(e) => handlePlayAudio(e, true)} /> :
                              <FaPause className='w-[25px] h-[32px]' color='white' onClick={(e) => handlePlayAudio(e, false)} />
                          }
                        </>
                      )}
                    </div>
                  </div>
                  <input
                    className="rounded-lg overflow-hidden appearance-none bg-gray-200 h-[5px] ease-linear duration-300 w-full px-2 mt-0"
                    type="range"
                    min="0"
                    max={totalTime}
                    step="1"
                    value={progress}
                  />
                </div> :
                <div className='bg-[#222222] flex justify-between items-center h-[88px] p-4'>
                  <span className='font-semibold text-white text-[18px]'>Please choose a Frequency to Play</span>
                  <div className='w-1/4 flex justify-center opacity-75' onClick={() => navigate('/starter-frequencies')}> <FaPlay className='w-[25px] h-[32px] text-white' /></div>
                </div>
            }
          </div >
        </div>
      }
    </>
  );
});

export default AudioPlayerMini;
