import React, { useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AppProvider';
import NavBar from '../shared/Nav/NavBar';
import SideBarMenu from '../shared/SidebarMenu/SideBarMenu';
import AudioPlayerMini from '../shared/Audio/AudioPlayerMini';
import ChatbotComponent from '../shared/Chatbot/ChatbotComponent';
import { motion } from 'framer-motion';
import Footer from '../shared/Footer/Footer';
import ModalAddNewCustomFrequencies from '../shared/modal/ModalAddNewCustomFrequencies';
import ModalAddNewPlaylists from '../shared/modal/ModalAddNewPlaylists';
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
  const { setDataMyPlaylist } = useContext(AuthContext);

  return (
    <div className="relative ">
      <NavBar />
      {/* <Alert /> */}
      <div className="min-h-screen flex bg-[rgb(236,245,244)]  pb-4 px-[3%] sm:px-[2%] pt-[80px]">
        <div className="md:w-1/4 lg:w-1/5">
          <SideBarMenu />
        </div>
        <div className="md:w-3/4 lg:w-4/5 md:px-4 lg:pl-8 w-full">
          <motion.div key={pathname} initial="initial" animate="in" variants={pageVariants} transition={pageTransition}>
            <Outlet />
            <AudioPlayerMini />
            <ChatbotComponent />
          </motion.div>
        </div>
      </div>
      <Footer />
      <ModalAddNewCustomFrequencies />
      {setDataMyPlaylist && <ModalAddNewPlaylists setDataMyPlaylist={setDataMyPlaylist} />}
    </div>
  );
};

export default MainLayout;
