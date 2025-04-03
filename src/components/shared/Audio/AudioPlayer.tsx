import React, { useState, useRef, useEffect, forwardRef, useMemo, useImperativeHandle, useContext } from 'react';

import playIcon from '~/assets/img/playlist/middle.png';
import loadingIcon from '~/assets/img/playlist/loading.svg';
import nextIcon from '~/assets/img/playlist/forward.png';
import pauseIcon from '~/assets/img/playlist/mute.png';
import suffOnIcon from '~/assets/img/playlist/shuffle_on.png';
import suffOffIcon from '~/assets/img/playlist/shuffle_off.png';


import siIcon from '~/assets/img/btn-sine-on.png';
import sqIcon from '~/assets/img/btn-sq-on.png';
import { FaLock } from 'react-icons/fa';
import { useAudio } from '~/components/context/AudioProvider';
import { AuthContext } from '~/components/context/AppProvider';

declare global {
	interface Window {
		webkitAudioContext: typeof AudioContext;
		audioGL: any;
		google: any;
		googleTranslateElementInit: any;
	}
}

const AudioPlayer = forwardRef((props: any, ref: any) => {
	const {
		playlists,
		playlistId,
		setPlaylistId,
		setPlaylist,
		playIndex,
		playNext,
		isPlay,
		setIsPlay,
		progress,
		setProgress,
		totalTime,
		formatTime,
		isLoading,
		playRepeat,
		wave,
		setPlayIndex,
		handlePause,
		changeRepeat,
		handleChangeWave,
		setPlaylistTitle,
		isShowAdvancedMode,
		isPlayWithSuff,
		handlePlayWithSuff,
	} = useAudio();
	const { isPremium } = useContext(AuthContext);

	const [_isPlay, _setIplay] = useState(false);
	const [_totalTime, _setTotalTime] = useState(0);
	const [_progress, _setProgress] = useState(0);
	const [_isLoading, _setLoading] = useState(false);


	const _handleFirstPlay = async () => {
		setPlaylist(props.trackProps)
		setPlaylistId(props.playlistId)
		setPlaylistTitle(props.albumInfo?.title || props.albumInfo?.name)
		await new Promise(r => setTimeout(r, 500));
	}

	const _checkInPlay: any = () => {
		let isItemInPlay = playlistId == props.playlistId
		return isItemInPlay
	}

	const _handlePlay = async (index: number = 0) => {
		const isItemInPlay = _checkInPlay();
		if (!isItemInPlay) {
			setPlayIndex(index)
			setProgress(index)
		} else {
			setPlayIndex(index)
		}
		await _handleFirstPlay()
		setIsPlay(true)
	}

	const _playNext = async () => {
		const isItemInPlay = _checkInPlay();
		const _idx = isItemInPlay ? playIndex : 0;
		await _handleFirstPlay()
		playNext(_idx)
	}

	useImperativeHandle(ref, () => ({
		togglePlay(audioIndex: number) {
			_handlePlay(audioIndex);
		},
	}));

	useEffect(() => {
		const isItemInPlay = _checkInPlay();

		if (isItemInPlay) {
			_setIplay(isPlay)
			_setTotalTime(totalTime)
			_setProgress(progress)
			_setLoading(isLoading)

		} else {
			_setLoading(false)
			_setTotalTime(0)
			_setIplay(false)
			_setProgress(0)
		}

	}, [isPlay, isLoading, playIndex, props.trackProps, progress])

	useEffect(() => {
		_setLoading(isLoading)
	}, [isLoading])

	const renderRepeatButton = () => {
		let buttonText = playRepeat == 0 ? 'Repeat OFF' : playRepeat == 1 ? 'Repeat ONE' : 'Repeat ALL'
		let className = playRepeat != 0 ? 'text-[#059F83]' : 'text-[#808080]'
		return (
			<button onClick={changeRepeat} className={`hover:opacity-80 duration-150 border-[2px] border-[#A5D4D8] rounded-[18px] px-2 h-[33px] w-[110px] font-semibold text-[13px] ${className}`}>{buttonText}</button>
		)
	}

	const playSuffButton = () => {
		return (<>
			{
				isPlayWithSuff ? <img
					onClick={handlePlayWithSuff}
					className="hover:cursor-pointer w-[33px] h-[33px] hover:opacity-80 duration-150"
					src={suffOffIcon}
					alt=""
				/> : <img
					onClick={handlePlayWithSuff}
					className="hover:cursor-pointer w-[33px] h-[33px]  hover:opacity-80 duration-150"
					src={suffOnIcon}
					alt=""
				/>
			}
		</>)
	}

	return (
		<div className="w-full">
			<div className="w-full flex lg:flex-row relative">
				<div className="w-full text-[#333]">
					<div className="bg-[#ECF5F4] rounded-md">
						<div className="bg-white rounded-md pt-10">
							<div className="flex items-center justify-center gap-1 sm:gap-2">
								{playSuffButton()}
								{_isLoading ? (
									<>
										<img
											className={` hover:cursor-pointer w-12 h-12 block hover:opacity-80 duration-150 `}
											src={loadingIcon}
											alt=""
										/>
									</>
								) : (
									<>

										<img
											onClick={() => _handlePlay()}
											className={` hover:cursor-pointer w-12 h-12 hover:opacity-80 duration-150 ${_isPlay ? 'hidden' : 'block'
												}`}
											src={playIcon}
											alt=""
										/>
										<img
											onClick={() => handlePause()}
											className={` hover:cursor-pointer w-12 h-12 hover:opacity-80 duration-150 ${!_isPlay ? 'hidden' : 'block'
												}`}
											src={pauseIcon}
											alt=""
										/>
									</>
								)}

								<img
									onClick={() => _playNext()}
									className="hover:cursor-pointer w-[33px] h-[33px] hover:opacity-80 duration-150"
									src={nextIcon}
									alt=""
								/>
								{renderRepeatButton()}
								{typeof props.trackProps[playIndex]?.url == 'number' && isShowAdvancedMode ? (
									<button
										type="button"
										onClick={handleChangeWave}
										className="w-8 h-8 rounded-full font-medium"
									>
										<img src={wave === "sine" ? siIcon : sqIcon} />
									</button>
								) : <span />}
							</div>
							{props.trackProps[playIndex]?.id != null ? <div className="px-4 mt-4 text-center font-semibold break-all text-base ">
								<span className=" overflow-hidden line-clamp-2">
									{props.trackProps[playIndex]?.title?.toString()}   {props.trackProps[playIndex]?.frequency_type != 'mp3'}
								</span>
							</div> : <span />
							}
							<div className="px-4 mt-4 ">
								<input
									className="rounded-lg overflow-hidden appearance-none bg-gray-200 h-2 w-full ease-linear duration-300 max-w-[800px] self-center"
									type="range"
									min="0"
									max={_totalTime}
									step="1"
									value={progress}
								/>
							</div>
							<div className="px-4 mt-4 text-center font-semibold flex justify-center items-center space-x-2">
								<span>{formatTime(_progress)}</span>
								<span>|</span>
								{!_isLoading ? (
									<span>{formatTime(_totalTime)}</span>
								) : (
									<img
										className="w-8 h-8 hover:opacity-80 transition-opacity duration-150"
										src={loadingIcon}
										alt="Loading"
									/>
								)}
							</div>
						</div>
					</div>
				</div>
				{props.isLocked ? (
					<div className=" absolute top-0 h-full w-full bg-[#100d0d6e]  flex justify-center items-center">
						<FaLock size={40} color="white" className="z-10 " />
					</div>
				) : <span />}
			</div>
		</div>
	);
});

export default AudioPlayer;
