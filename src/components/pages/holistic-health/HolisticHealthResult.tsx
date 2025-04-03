
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import { getResults } from '~/services/HolisticHealth';

import 'react-circular-progressbar/dist/styles.css';
import AnimatedProgressProvider from './AnimatedProgressProvider';


const CircleProgress = ({ percentage }: { percentage: number }) => {
    return (
        <div className="flex flex-col relative">
            <div className='w-[140px] 2xl:w-[152px] relative'>
                <AnimatedProgressProvider
                    valueStart={0}
                    valueEnd={percentage}
                    duration={2}
                >
                    {(value: any) => {
                        const roundedValue = Math.round(value);
                        return (
                            <CircularProgressbar
                                value={value}
                                text={`${roundedValue}`}
                                styles={buildStyles({
                                    strokeLinecap: 'butt',
                                    pathColor: `rgba(41, 125, 130, 1)`,
                                    trailColor: '#D9D9D9',
                                    pathTransition: "none",
                                    textColor: '#00000099',
                                    textSize: '28px',
                                })}
                            />
                        );
                    }}
                </AnimatedProgressProvider>
            </div>
        </div>
    );
};



const VerticalProgressBar = ({ targetPercentage, questionTypeName, ratio }: { targetPercentage: number, questionTypeName: string, ratio: string }) => {
    const [currentPercentage, setCurrentPercentage] = useState(0);

    useEffect(() => {
        const duration = 1000;
        const interval = 50;
        const step = targetPercentage / (duration / interval);

        const intervalId = setInterval(() => {
            setCurrentPercentage((prev) => {
                if (prev + step >= targetPercentage) {
                    clearInterval(intervalId);
                    return targetPercentage;
                }
                return prev + step;
            });
        }, interval);

        return () => clearInterval(intervalId);
    }, [targetPercentage]);

    return (
        <div className="relative">
            <div className='h-full px-[20px] 2xl:px-[30px] '>
                <div className={`h-full flex items-end justify-center ${!currentPercentage ? 'border-[#297D82B2] border-b' : ''}`}>
                    <div
                        className="relative w-[60px] bg-[#297D82B2] transition-all duration-500 rounded-[5px]"
                        style={{
                            height: `${currentPercentage}%`,
                            transform: `translateY(${currentPercentage == 0 ? '0px' : currentPercentage - targetPercentage})`,
                            opacity: `${currentPercentage < targetPercentage ? 0.8 : 1}`
                        }}
                    >
                        <span className="absolute top-[16px] left-1/2 -translate-x-1/2 font-normal text-sm text-[#fff] ">{ratio}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};


const HolisticHealthResult = ({ isFinishedAnswer, handleCaculate }: any) => {
    const [holisticResult, setHolisticResult] = useState([]);
    const [totalPercent, setTotalPercent] = useState(0)
    const [fetchLoading, setFetchLoading] = useState(true)
    const userId = localStorage.getItem('id_user');
    const [visibleTypeNameIndex, setVisibleTypeNameIndex] = useState(0);

    useEffect(() => {
        console.log(isFinishedAnswer)
        if (isFinishedAnswer) {
            setFetchLoading(true)
            handleCaculate(true)
            getResults({
                userId, limit: 1
            })
                .then((data: any) => {
                    const holisticData = data?.data.map((item: any) => ({
                        ...item,
                        targetPercentage: Math.round((item.obtained_points / item.total_points) * 100)
                    }))
                    const totalObtainedPoints = data?.data.reduce((sum: number, item: any) => sum + parseInt(item.obtained_points, 10), 0);
                    const totalTotalPoints = data?.data.reduce((sum: number, item: any) => sum + parseInt(item.total_points, 10), 0);
                    setHolisticResult(holisticData)
                    setTotalPercent(totalObtainedPoints)
                    setTimeout(() => {
                        setFetchLoading(false)
                        handleCaculate(false)
                    }, 3000)
                })
                .catch((error: any) => {
                    handleCaculate(false)
                    setFetchLoading(false)
                });
        }

    }, [isFinishedAnswer])

    useEffect(() => {
        if (visibleTypeNameIndex < holisticResult.length) {
            const interval = setInterval(() => {
                setVisibleTypeNameIndex((prev) => Math.min(prev + 1, holisticResult.length));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [visibleTypeNameIndex, holisticResult.length]);

    const valueMarks = ['00', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100'];

    return (
        <>
            {fetchLoading ? (
                <>
                    {holisticResult[visibleTypeNameIndex]?.type_name && (
                        <div
                            className={`flex justify-center flex-col h-screen w-[300px] mx-auto transition-opacity duration-1000 ${!fetchLoading ? 'opacity-0' : 'opacity-100'
                                }`}
                        >
                            <div className="flex space-x-4 justify-center mb-3">
                                <div className="w-4 h-4 bg-[#297D82] rounded-full animate-sequential-bounce-1"></div>
                                <div className="w-4 h-4 bg-[#297D82] rounded-full animate-sequential-bounce-2"></div>
                                <div className="w-4 h-4 bg-[#297D82] rounded-full animate-sequential-bounce-3"></div>
                            </div>
                            <div className="text-center text-[26px]">
                                <p className="animate-sequential-bounce-text ">Calculating</p>

                                <p
                                    className={` transition-opacity duration-1000 ${holisticResult[visibleTypeNameIndex]?.type_name ? 'opacity-100' : 'opacity-0'
                                        }`}>
                                    {holisticResult[visibleTypeNameIndex]?.type_name}
                                </p>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <motion.div
                    animate={{
                        x: ["-0.75px", "0.75px", "-0.75px", "0.75px", "0px"],
                    }}
                    transition={{
                        duration: 0.1,
                        repeat: 30,
                        repeatDelay: 0,
                        delay: 1.5, 
                    }}
                    style={{ transformOrigin: "center" }}
                    className="absolute max-h-screen h-screen flex flex-col items-center justify-center pt-[88px]">
                    <div className="w-[380px] 2xl:w-[450px] h-[180px] 2xl:h-[200px] pl-[40px] 2xl:pl-[67px] pr-[24px] flex justify-center items-center gap-[10px] bg-[#297D8226] shadow-[14px_15px_17.6px_0px_#D9D9D94D] rounded-[20px]">
                        <h2 className="text-[28px] leading-[28px] font-normal text-[#00000099] ">Your holistic wellness score:</h2>
                        <CircleProgress percentage={totalPercent} />
                    </div>
                    <div className="mt-[40px] flex flex-col flex-grow">
                        <div className='flex justify-center flex-grow'>
                            <div className="flex flex-col justify-end w-[66px]">
                                {valueMarks.reverse().map((value) => (
                                    <div className={`relative ${value == '100' ? '' : 'flex-1'}`}>
                                        <span key={value} className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-[#808080B0] text-center" >
                                            {value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className='flex gap-[12px]'>
                                {holisticResult.map((item, index) => (
                                    <VerticalProgressBar
                                        key={index}
                                        targetPercentage={item.targetPercentage}
                                        ratio={`${item.obtained_points}/${item.total_points}`}
                                        questionTypeName={item.type_name}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className='flex'>
                            <div className='w-[66px]'></div>
                            <div className='bar-bottom'>
                                <div className='bg-[#0000001A] h-[1px] my-[8px] mx-[8px]'></div>
                                <div className='flex gap-[12px]'>
                                    {holisticResult.map((item) => (
                                        <div className="text-center p-[10px] text-[#808080B0] break-words 2xl:w-[120px] w-[90px]" >{item.type_name}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className='mt-auto mb-[15px] w-full text-center text-xs'>The scoring in this questionnaire is for personal awareness only and does not constitute a medical evaluation, diagnosis, or treatment recommendation.</p>
                </motion.div>
            )}

        </>
    )
}

export default HolisticHealthResult