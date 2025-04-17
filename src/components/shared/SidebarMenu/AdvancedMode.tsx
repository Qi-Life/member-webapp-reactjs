import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAudio } from '~/components/context/AudioProvider';
import { AppContext } from '~/components/context/AppProvider';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from "framer-motion";


interface SwitcherInterface {
    item?: string,
    isChecked?: boolean;
    handleShowAdvancedMode?: () => void
}


const Switcher = (props: SwitcherInterface) => {
    const [isChecked, setIsChecked] = useState(props.isChecked);

    const handleShowAdvancedMode = () => {
        props.handleShowAdvancedMode()
    };

    useEffect(() => {
        setIsChecked(props.isChecked)
    }, [props.isChecked])


    return (
        <label className="flex items-center relative w-max cursor-pointer select-none switcher">
            <input
                type="checkbox"
                checked={isChecked}
                onChange={handleShowAdvancedMode}
                className={`appearance-none transition-colors cursor-pointer w-[70px] h-[25px] rounded-full bg-[#D9D9D9] checked:bg-[#409F83]`}
            />
            {!isChecked ? <span className="absolute  font-medium uppercase right-2 text-white font-semibold	text-sm"> OFF </span> :
                <span className="absolute font-medium uppercase left-4 text-white font-semibold	text-sm"> ON </span>}
            <span
                className={`w-[20px] h-[20px] absolute  rounded-full transform transition-transform top-1/2 -translate-y-1/2  bg-white ${!isChecked ? 'left-1' : 'right-8'
                    }`}
                style={{ top: '50%' }}
            />
        </label>
    );
};


export default function AdvancedMode({ handleClickLink }: any) {
    const { handleShowAdvancedMode, isShowAdvancedMode, isPlayScalar } = useAudio()
    const { isPremium } = useContext(AppContext);
    const location = useLocation(); // Get the current location

    const navigate = useNavigate()

    const onClickSilent = (tier: string) => {
        if (handleClickLink) {
            handleClickLink()
        }
        navigate(`/silent-quantum?tier=${tier}`)
    }

    const navigateToAll = () => {
        navigate(`/silent-quantum?tier=all`)
    }

    const checkToggleAdvancedMode = () => {
        if (location.pathname === '/silent-quantum') {
            if (!isPlayScalar) {
                handleShowAdvancedMode()
                navigate('/')
            } else {
                toast.error(
                    "You have the active energies. Cannot turn OFF Advanced mode",
                    {
                        position: "top-center",
                        autoClose: 5000
                    }
                );
            }
        } else {
            if (isPlayScalar) {
                toast.error(
                    "You're have active energies, cannot turn OFF",
                    {
                        position: "top-center",
                        autoClose: 5000
                    }
                );
            } else {
                handleShowAdvancedMode()
            }
        }
    }

    const renderMenu = () => {
        const menus = [
            { name: 'Silent Quantum', tier: '' },
            { name: 'Silent Quantum Pro', tier: 'pro' },
            // { name: 'Silent Quantum Advanced', tier: 'advanced' }
        ];
        const searchParams = new URLSearchParams(location.search); // Parse the query string
        const menuVariants = {
            hidden: { opacity: 0, y: -10 },
            visible: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -10 }
        };

        const activeBgClasses = 'bg-[#ECF5F4] font-bold rounded-[10px]'
    
        return (
            <AnimatePresence>
                {menus.map((item: any) => (
                    <motion.li
                        key={item.name}
                        className={`px-3 py-2 ${location.pathname === '/silent-quantum' &&
                            searchParams.get('tier') === item.tier
                                ? activeBgClasses
                                : ''}`}
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <a
                            className={`text-[#000] cursor-pointer
                                        ${location.pathname === '/silent-quantum' &&
                                        searchParams.get('tier') === item.tier
                                            ? 'active '
                                            : ''}
                                        `}
                            onClick={() => onClickSilent(item.tier)}
                        >
                            {item.name}
                        </a>
                    </motion.li>
                ))}
            </AnimatePresence>
        );
    };
    

    return (
        <>
            {isPremium &&
                <div>
                    <h3 className={`block text-base font-semibold relative cursor-pointer flex justify-between flex-wrap gap-2 ${!isShowAdvancedMode ? 'mb-5' : ''}`} >
                        <p className='text-black cursor-pointer' onClick={navigateToAll}>Advance Mode</p> <Switcher handleShowAdvancedMode={checkToggleAdvancedMode} isChecked={isShowAdvancedMode} />
                    </h3>
                    {isShowAdvancedMode ? <ul className=''>
                        {renderMenu()}
                    </ul> : <div />}
                </div>
            }
        </>
    );
}
