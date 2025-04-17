import React, { useContext, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppProvider';
import SideBarMenu from '../shared/SidebarMenu/SideBarMenu';
import AudioPlayerMini from '../shared/Audio/AudioPlayerMini';
import ChatbotComponent from '../shared/Chatbot/ChatbotComponent';
import { motion } from 'framer-motion';
import ModalAddNewCustomFrequencies from '../shared/modal/ModalAddNewCustomFrequencies';
import ModalAddNewPlaylists from '../shared/modal/ModalAddNewPlaylists';
import MainNavBar from '../shared/Nav/MainNavBar';

const pageVariants = {
    initial: {
        opacity: 0,
    },
    in: {
        opacity: 1,
    },
    out: {
        opacity: 0,
    },
};

const pageTransition = {
    type: 'tween',
    ease: 'linear',
    duration: 0.5,
};

const MainLayout = () => {
    const { pathname } = useLocation();
    const { setDataMyPlaylist } = useContext(AppContext);
    const { togglMobileSidebar, isSidebarMobileOpen } = useContext(AppContext);
    
    return (
        <div className="relative min-h-screen flex justify-between bg-[#ECF5F4] overflow-x-hidden">
            {/* Mobile Sidebar */}
            <div
                className={`
                    fixed top-0 left-0 h-full w-1/2 bg-white z-40 transform
                    transition-transform duration-300 ease-in-out
                    ${isSidebarMobileOpen ? 'translate-x-0' : '-translate-x-full'}
                    xl:hidden
                `}
            >
                <button
                    onClick={togglMobileSidebar}
                    className="absolute top-4 right-4 z-50 text-white text-2xl"
                >
                    ✕
                </button>
                <SideBarMenu />
            </div>

            {/* Sidebar for desktop */}
            <div className="lg:min-w-[21.375rem] hidden xl:block">
                <SideBarMenu />
            </div>

            {/* Main content */}
            <div className="flex-grow overflow-x-hidden">
                <MainNavBar wrapperClass="" />
                <motion.div
                    key={pathname}
                    className="pt-[1.56rem] px-[1.875rem]"
                    initial="initial"
                    animate="in"
                    variants={pageVariants}
                    transition={pageTransition}
                >
                    <Outlet />
                    <AudioPlayerMini />
                    <ChatbotComponent />
                </motion.div>
            </div>

            <ModalAddNewCustomFrequencies />
            {setDataMyPlaylist && (
                <ModalAddNewPlaylists setDataMyPlaylist={setDataMyPlaylist} />
            )}

        </div>

    );
};

export default MainLayout;
