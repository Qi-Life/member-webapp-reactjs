import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import * as Tone from 'tone';
import { getAudioPlayStorelist, getScalarStoreList, setAudioPlayStorelist, setScalarStoreList } from '../shared/Audio/audioStore';

const AudioContext = createContext<any>({
    playlists: [],
    playIndex: 0,
    clearAll: () => { },
    formatTime: () => { },
    setIsPlayType: () => { },
    setIsPlay: () => { },
    setPlayIndex: () => { },
    setProgress: () => { },
    setPlaylist: () => { },
    setPlaylistId: () => { },
    setPlaylistTitle: () => { },
    updateScalar: () => { },
})

export const useAudio = () => useContext(AudioContext);

const FREQUENCY_TIME = 300
const PLAY_REPEAT = +localStorage.getItem('playRpeat') || 0
const PLAYLIST_ID = localStorage.getItem('playlistId')
const PLAYLIST_TITLE = localStorage.getItem('playlistTitle')
const ADVANCED_MODE = localStorage.getItem('isShowAdvancedMode') ? JSON.parse(localStorage.getItem('isShowAdvancedMode')) : false
const PLAY_WITH_SUFF = localStorage.getItem('isPlayWithSuff') ? JSON.parse(localStorage.getItem('isPlayWithSuff')) : false

// const SCALAR_LIST = getScalarStoreList()

export const AudioProvider = ({ children }: any) => {
    const [isPlayType, setIsPlayType] = useState(null)
    const [isPlay, setIsPlay] = useState(false);
    const [progress, setProgress] = useState(0);
    const [playIndex, setPlayIndex] = useState(0);
    const [totalTime, setTotalTime] = useState(FREQUENCY_TIME);
    const [isLoading, setIsLoading] = useState(false);
    const [playRepeat, setPlayRepeat] = useState(PLAY_REPEAT);
    const [playlistId, setPlaylistId] = useState(PLAYLIST_ID);
    const [playlists, setPlaylist] = useState([]);
    const [playlistTitle, setPlaylistTitle] = useState(PLAYLIST_TITLE);

    const [silentScalars, setScalarList] = useState([]);
    const [isPlayScalar, setIsPlayScalar] = useState(false);
    const [isOpenPlaySidebarRight, setIsOpenPlaySidebarRight] = useState(false)
    const [isShowAdvancedMode, setShowAdvancedMode] = useState(ADVANCED_MODE)

    const [wave, setWave] = useState<OscillatorType>('sine');
    const [isPlayWithSuff, SetIsPlayWithSuff] = useState(PLAY_WITH_SUFF);

    const audioRef = useRef(null);
    const oscillatorRef = useRef(null);
    const intervalIDRef = useRef(null);
    const userToken = localStorage.getItem('userToken')

    const playAudio = async (currentIndex: number) => {
        setIsLoading(true);
        audioRef.current.setAttribute('webkit-playsinline', 'true');
        audioRef.current.setAttribute('playsinline', 'true');
        // Reset audio element
        audioRef.current.src = playlists[currentIndex]?.url || "";
        audioRef.current.load(); // Ensure that the audio element is properly loaded
    
        setTimeout(() => {
            let playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('___', audioRef.current.duration)
                    setTotalTime(audioRef.current.duration);
                    setIsLoading(false);
                }).catch((err:any) => {
                    // Handle error if needed
                    setIsLoading(false);
                });
                window.audioGL = audioRef.current;
            } else {
                setIsLoading(false);
            }
        }, 300);
    };

    const handleStop = async (progressTime?: number) => {
        if (progressTime === 0) {
            setProgress(0);
        }
        if (audioRef.current) audioRef.current.pause();
        if (oscillatorRef.current) {
            oscillatorRef.current.stop();
            oscillatorRef.current.disconnect(); // Disconnect oscillator
            oscillatorRef.current = null;
            audioRef.current.srcObject = null;
        }
        if (intervalIDRef.current) {
            clearInterval(intervalIDRef.current);
            intervalIDRef.current = null; // Ensure it's reset after clearing
        }
    };

    const handlePlay = async (currentIndex: number = playIndex, _progress: number = progress) => {
        console.log("🚀 ~ handlePlay ~ currentIndex:", currentIndex)
        
        if(isPlayWithSuff){
            currentIndex = Math.floor(Math.random() * playlists.length);
            _playMixed(currentIndex)
        }else{
            while (!playlists[currentIndex]?.id || playlists[currentIndex]?.lock) {
                if (currentIndex < playlists.length) {
                    currentIndex += 1;
                } else {
                    currentIndex = 0;
                }
                await new Promise(r => setTimeout(r, 200));
            }
            _playMixed(currentIndex)
        }
    }

    const handlePlayWithSuff = () => {
        SetIsPlayWithSuff(!isPlayWithSuff)
        localStorage.setItem('isPlayWithSuff', JSON.stringify(!isPlayWithSuff))
    }

    const handlePause = () => {
        handleStop();
        setIsPlay(false)
    }

    const _playMixed = (currentIndex: number) => {
        const playerType = typeof playlists[currentIndex]?.url == 'number' ? 'frequency' : 'audio';
        playerType == 'audio' ? playAudio(currentIndex) : playFrequency(currentIndex);
    }

    useEffect(() => {
        handleStop()
        if (isPlay) {
            if (playlists[playIndex]?.id && !playlists[playIndex]?.lock) {
                handlePlay();
            } else {
                playNext()
            }
        }
    }, [isPlay])

    const changeRepeat = () => {
        const newRepeat = (playRepeat + 1) % 3;
        setPlayRepeat(newRepeat);
        localStorage.setItem('playRpeat', JSON.stringify(newRepeat))
    };

    const handleChangeWave = () => {
        setWave((prevWave): any => {
            let newWave = prevWave === 'sine' ? 'square' : 'sine'
            return newWave
        });
    };

    const playNext = async (_playIndex = playIndex) => {
        let nextIndex = _playIndex < playlists.length - 1 ? _playIndex + 1 : 0;
        if(isPlayWithSuff){
            nextIndex = Math.floor(Math.random() * playlists.length);
        }else{
            while (!playlists[nextIndex]?.id || playlists[nextIndex]?.lock) {
                if (nextIndex < playlists.length) {
                    nextIndex += 1;
                } else {
                    nextIndex = 0;
                }
                await new Promise(r => setTimeout(r, 200));
            }
        }
        setPlayIndex(nextIndex)
        setIsPlay(true)
    };

    const prevSong = async () => {
        handleStop(0);
        const prevIndex = playIndex > 0 ? playIndex - 1 : 0;
        _playMixed(prevIndex)
    };

    const playFrequency = (currentIndex: number) => {
        setTotalTime(FREQUENCY_TIME)
        setIsLoading(true)
        const source = +playlists[currentIndex]?.url;
        // Stop and disconnect any existing oscillator
        if (oscillatorRef.current) {
            oscillatorRef.current.stop();
            oscillatorRef.current.disconnect();
            oscillatorRef.current = null; // Clear the oscillator reference
        }
        const oscillator = new Tone.Oscillator(source, wave);
        var dest = oscillator.context.createMediaStreamDestination();
        oscillator.connect(dest);
        oscillator.toDestination().start();
        audioRef.current.srcObject = dest.stream;
        audioRef.current.play();
        oscillatorRef.current = oscillator;
        setTimeout(() => {
            setIsLoading(false)
        }, 300)
    };

    const handleEndPlay = () => {
        handleStop(0);
        setIsPlay(false);
        const currentRepeat = +localStorage.getItem('playRpeat');

        setTimeout(() => {
            setIsPlay(true)
            if (currentRepeat == 1) {
                handlePlay();
            } else if (currentRepeat == 2) {
                playNext();
            }
        }, 300)
    };

    const formatTime = (time: number = 0) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleTimeUpdate = () => {
        intervalIDRef.current = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress >= totalTime) {
                    handleEndPlay();
                    return 0
                } else {
                    return !!oldProgress ? oldProgress + 1 : 1;
                }
            });
        }, 1000);
    };

    const clearAll = () => {
        handleStop(0)
        setPlayIndex(0)
        setIsPlay(false)
        setScalarList([])
        setPlaylist([])     
    }

    const updateScalar = (newScalars: []) => {
        setScalarList(newScalars)
        setIsPlayScalar(newScalars.length != 0)
    }


    const togglePlayScalar = () => {
        if (silentScalars.length > 0) {
            setIsPlayScalar(!isPlayScalar)
        }
    }

    const handleShowAdvancedMode = () => {
        setShowAdvancedMode(!isShowAdvancedMode)
        if(!isShowAdvancedMode == true){
            localStorage.setItem('isShowAdvancedMode', JSON.stringify(true))
        }else{
            localStorage.removeItem('isShowAdvancedMode')
        }
    }


    useEffect(() => {
        if (wave && isPlay) {
            handleStop()
            _playMixed(playIndex)
        }
    }, [wave])


    useEffect(() => {
        if (silentScalars.length > 0) {
            setScalarStoreList(silentScalars)
        }
    }, [silentScalars])

    useEffect(() => {
        if (playlists.length > 0) {
            setAudioPlayStorelist(playlists)
        }
    }, [playlists])

    useEffect(() => {
        if (playlistTitle) {
            localStorage.setItem('playlistTitle', playlistTitle)
        }
    }, [playlistTitle])

    useEffect(() => {
        if (playlistId) {
            localStorage.setItem('playlistId', playlistId)
        }
    }, [playlistId])

    useEffect(() => {
        handleStop(0)
        if (isPlay) {
            if (playlists[playIndex]?.id && !playlists[playIndex]?.lock) {
                handlePlay();
            } else {
                playNext()
            }
        }
    }, [playIndex, playlistId])

    useEffect(() => {
        if (isPlay && !isLoading) {
            handleTimeUpdate()
        }

    }, [isLoading])

    useEffect(() => {
        if (!userToken) {
            setPlaylist([])
            setScalarList([])
        }
    }, [userToken])



    const value = {
        isPlayWithSuff, handlePlayWithSuff,
        isShowAdvancedMode,
        handleShowAdvancedMode,
        playlists, setPlaylist, isPlay, setIsPlay, 
        progress, setProgress,
        playIndex,
        setPlayIndex,
        totalTime,
        isLoading,
        setIsLoading,
        playRepeat,
        wave,
        audioRef,
        oscillatorRef,
        playAudio,
        handleStop,
        handlePlay,
        handlePause,
        changeRepeat,
        handleChangeWave,
        prevSong,
        playNext,
        formatTime,
        isOpenPlaySidebarRight, setIsOpenPlaySidebarRight,
        playlistId, setPlaylistId,
        silentScalars, updateScalar,setIsPlayScalar,
        isPlayScalar, togglePlayScalar,
        isPlayType, setIsPlayType,
        playlistTitle, setPlaylistTitle,
        clearAll
    };

    return <AudioContext.Provider value={value}>
        <>
           <audio ref={audioRef} src={"https://apiadmin.qienergy.ai/assets/uploads/mp3/5954/Fall Asleep Fast - Deep Sleep.mp3"} id="soundPlay" />
            {children}
        </>

    </AudioContext.Provider>;
};
