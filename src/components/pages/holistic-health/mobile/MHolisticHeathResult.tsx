import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';

import MHolisticChart from './MHolisticChart';

import MBg1 from '~/assets/img/holistic/m-bg1.png';
import MBg2 from '~/assets/img/holistic/m-bg2.png';
import MBg3 from '~/assets/img/holistic/m-bg3.png';
import MBg4 from '~/assets/img/holistic/m-bg4.png';
import MBg5 from '~/assets/img/holistic/m-bg5.png';
import { getResults } from '~/services/HolisticHealth';
import './MHolistic.css'

const styles = [
    { url: MBg1, color: '#DCB867', barColor: '#EBC77633' },
    { url: MBg2, color: '#A0E56B', barColor: '#AFD79033' },
    { url: MBg3, color: '#79A4E8', barColor: '#95AED633' },
    { url: MBg4, color: '#F08B7C', barColor: '#FDC6BE33' },
    { url: MBg5, color: '#BB88E8', barColor: '#D6C6E433' },
];

const animateCircleColors = [
    ['#EBC776', '#AFD790'],
    ['#AFD790', '#95AED6'],
    ['#95AED6', '#FDC6BE'],
    ['#FDC6BE', '#D6C6E4'],
]

interface LocationState {
    caculateLoading?: boolean;
}

const MHolisticHeathResult = () => {
    const [isLoading, setIsLoading] = useState(false)
    const location = useLocation()
    const state = location.state as LocationState
    const userId = localStorage.getItem('id_user');
    const [caculateLoading, setCaculateLoading] = useState(state?.caculateLoading || false)
    const [holisticResult, setHolisticResult] = useState([]);
    const [totalPercent, setTotalPercent] = useState(0)
    const [animateBgIndex, setAnimateBg] = useState(0)

    useEffect(() => {
        setIsLoading(true)
        getResults({
            userId, limit: 1
        })
            .then((data: any) => {
                const holisticData = data?.data.map((item: any, index: number) => ({
                    ...item,
                    style: styles[index],
                    targetPercentage: Math.round((item.obtained_points / item.total_points) * 100)
                }))

                const totalObtainedPoints = data?.data.reduce((sum: number, item: any) => sum + parseInt(item.obtained_points, 10), 0);
                
                const totalTotalPoints = data?.data.reduce((sum: number, item: any) => sum + parseInt(item.total_points, 10), 0);
                setHolisticResult(holisticData)
                setTotalPercent(Math.round((totalObtainedPoints / totalTotalPoints) * 100))

                setCaculateLoading(false)
                setTimeout(()=> {
                    setIsLoading(false)
                }, 3000)
            })
            .catch((error: any) => {
                setIsLoading(false)
                setCaculateLoading(false)
            });
    }, [state])

    useEffect(() => {
        const animateCircletimeoutId = setTimeout(() => {
            setAnimateBg((prev)=> {
                return prev < animateCircleColors.length - 1 ? prev + 1 : 0;
            })
        }, 1000)
        return () => clearTimeout(animateCircletimeoutId); 
    }, [animateBgIndex])

    return (
        <div className='flex flex-col items-center justify-center bg-[#EBEBEB]'>
            {(isLoading) ?
                <div className='h-screen'>
                    <h2 className='flex flex-col items-center py-20'>
                        <span className='font-semibold text-[18px] flex'>Calculating
                            <span className="loading">
                                <span className="loading__dot"></span>
                                <span className="loading__dot"></span>
                                <span className="loading__dot"></span>
                            </span>
                        </span>
                        <span className="font-black text-[32px] leading-[40px] text-[#39353D] your font-[900]">YOUR</span>
                        <span className="font-black text-[32px] leading-[40px] text-[#39353D] health font-[900]">WELLNESS</span>
                        <span className="font-black text-[32px] leading-[40px] text-[#39353D] score font-[900]">SCORE</span>
                    </h2>
                    <div className='loading-ic flex justify-center items-center'>
                        <div className="rounded-full w-[150px] h-[150px] animate-swapA z-10"
                            style={{ backgroundColor: animateCircleColors[animateBgIndex][0] }}
                        ></div>
                        <div className="rounded-full w-[100px] h-[100px] animate-swapB z-0"
                            style={{ backgroundColor: animateCircleColors[animateBgIndex][1] }}
                        ></div>
                    </div>
                </div>
                :
                <MHolisticChart questionData={holisticResult} totalPercent={totalPercent} />
            }
        </div>
    )
}

export default MHolisticHeathResult;
