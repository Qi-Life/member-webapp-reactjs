// src/components/AudioPlayer.js
import React, { useEffect, useRef } from 'react';
import { useAudio } from '~/components/context/AudioProvider';
import { getSilentScalarSource } from '~/services/SilentScalarServices';

const AudioMultiPlayer = ({ sources }: any) => {
    const audioRefs = useRef([]);
    const {
        isPlayScalar
    } = useAudio();

    const handlePlay = () => {
        if (audioRefs.current) {
            audioRefs.current.map((audio, index) => {
                try {
                    audio.setAttribute('webkit-playsinline', 'true');
                    audio.setAttribute('playsinline', 'true');
                    let playPromise = audio.play()
                    if (playPromise != undefined) {
                        playPromise.then(() => {
                            console.log('Play ok')
                        })
                            .catch((err: any) => {
                                console.log("🚀 ~ audioRefs.current.forEach ~ err:", err)
                            });
                    }
                } catch (error) {
                    console.log("🚀 ~ audioRefs.current.map ~ error:", error)
                }
            })
        }
    }

    const handleStop = () => {
        audioRefs.current.map((audio, index) => {
            try {
                audio.pause()
                audio.currentTime = 0
            } catch (error) {
                console.log("🚀 ~ audioRefs.current.map ~ error:", error)
            }
        })
    }

    const handleEnded = (index: number) => {
        console.log("🚀 ~ handleEnded ~ index:", index)
        audioRefs.current[index].currentTime = 0;
        audioRefs.current[index].play();
    };

    useEffect(() => {
        if (isPlayScalar) {
            handlePlay()
        } else {
            handleStop()
        }
        audioRefs.current.forEach((audio, index) => {
            if (audio) {
                audio.addEventListener('ended', () => handleEnded(index));
            }
        });

        return () => {
            audioRefs.current.forEach((audio, index) => {
                if (audio) {
                    audio.removeEventListener('ended', () => handleEnded(index));
                }
            });
        };
    }, [isPlayScalar]);


    useEffect(() => {
        audioRefs.current = audioRefs.current.filter(audio => audio !== null)
        if (isPlayScalar) {
            handlePlay()
        } else {
            handleStop()
        }
        audioRefs.current.forEach((audio, index) => {
            if (audio) {
                audio.addEventListener('ended', () => handleEnded(index));
            }
        });
    }, [sources])

    return (
        <div >
            {sources && sources.map((item: any, index: number) => (
                <div key={item.id} >
                    <audio ref={(el) => (audioRefs.current[index] = el)} src={getSilentScalarSource(item.silent_url)} />
                </div>
            ))}
        </div>
    )
};

export default AudioMultiPlayer;
