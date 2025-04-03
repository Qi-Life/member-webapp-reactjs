import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import V1Image from '~/assets/img/holistic/v1.png';
import V2Image from '~/assets/img/holistic/v2.png';
import S1Image from '~/assets/img/holistic/undraw_pilates_ltw9.png';
import S2Image from '~/assets/img/holistic/undraw_mindfulness_8gqa.png';
import S3Image from '~/assets/img/holistic/undraw_sunlight_re_0usx.png';
import S3V2Image from '~/assets/img/holistic/undraw_sunlight_re_0usx (2).png';

const HolisticHealthLanding1 = () => {
    const [animationStarted, setAnimationStarted] = useState(false);
    const [animationEnded, setAnimationEnded] = useState(false);
    const [isChangedImage, setIsChangedImage] = useState(false);

    const navigate = useNavigate()

    const handleOnLoad = () => {
        setAnimationStarted(true);
    };

    const handleAnimationEnd = () => {
        setTimeout(() => {
            setAnimationEnded(true);
        }, 1500)
        setTimeout(() => {
            setIsChangedImage(true);
        }, 800)
    };

    useEffect(() => {
        localStorage.setItem('isStartholistic', "0")
    }, [])

    return (
        <div className={`min-h-screen flex flex-col ${animationEnded ? 'bg-[#dfebec]' : 'bg-white'}`}>
            <div className="relative flex-grow mx-auto w-[95%] sm:w-1/2 h-full flex flex-col items-center justify-center">
                <div className='flex flex-col justify-center flex-1'>
                    <div className="flex justify-center items-center mb-10">
                        <div className="img-containter relative">
                            <img
                                src={setIsChangedImage ? V2Image : V1Image}
                                className={`${animationStarted && !animationEnded
                                    ? 'transition-all duration-1000 animate-grow-to-screen'
                                    : 'transition-opacity duration-1000 animate-fadeIn'
                                    }`}
                                onLoad={handleOnLoad}
                                onAnimationEnd={handleAnimationEnd}
                            />
                            <img
                                src={S1Image}
                                className={`absolute top-[90px] left-[-45px] transition-all duration-1000 ${animationStarted ? 'left-[25px]' : ''}`}
                            />

                            <img
                                src={S2Image}
                                className={`absolute bottom-[-20px] left-1/2 -translate-x-1/2 transition-all duration-1000 ${animationStarted ? 'bottom-[20px]' : ''}`}
                            />
                            <img
                                src={animationStarted ? S3Image : S3V2Image}
                                className={`absolute right-10 top-[45px] transition-all duration-1000 ${animationStarted ? 'right-5 top-10' : ''}`}
                            />
                        </div>
                        <div className='relative'>
                            <h2 className={`max-w-[267px] pt-10 text-center text-[#2F2E41] text-4xl xl:text-[40px] leading-[50px] font-normal relative transition-all duration-1000 ${animationStarted ? 'top-0' : 'top-[300px] '}`}
                                style={{ marginLeft: '-8px' }}
                            >
                                <span className="block">HOLISTIC</span>
                                <span className="block">WELLNESS</span>
                                <span className="block">ASSESSMENT</span>
                            </h2>
                        </div>
                    </div>
                    <button className="mx-auto my-[40px] rounded-md border border-black w-[200px] h-[60px] text-xl xl:text-2xl font-normal hover:bg-[#EAEAEA] 
                    active:bg-[#297D824D] " onClick={() => navigate('/holistic-health/start')}
                        style={{ opacity: animationEnded ? '1' : 0 }}
                    >
                        START NOW
                    </button>
                </div>
            </div>
            <div className='w-[95%] xl:w-1/2 text-center space-y-3 pb-[10px] mx-auto'  style={{ opacity: animationEnded ? '1' : 0 }}>
                <p className='text-[#2F2E41] text-xs font-normal'>
                    This questionnaire is intended for informational and personal wellness purposes only. It is not a medical assessment, diagnosis, or treatment tool and should not be used as a substitute for professional medical advice, diagnosis, or treatment.
                </p >
                <p className='text-[#2F2E41] text-xs font-normal'>
                    If you have any health concerns or medical conditions, please consult a qualified healthcare provider before making any changes to your diet, lifestyle, or wellness practices. The information provided in this questionnaire is for general self-reflection and does not constitute medical advice.
                </p>
                <p className='text-[#2F2E41] text-xs font-normal'>
                    By proceeding with this questionnaire, you acknowledge that it is for personal awareness only and does not replace guidance from a healthcare professional.
                </p>
            </div>
        </div>
    );
};

export default HolisticHealthLanding1;
