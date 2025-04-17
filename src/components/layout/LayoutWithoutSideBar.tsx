import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from '../shared/Nav/NavBar';
import { motion } from 'framer-motion';
import AudioPlayerMini from '../shared/Audio/AudioPlayerMini';
import ModalCreateNewPlaylist from '../shared/modal/ModalCreateNewPlaylist';
import ModalEditPlaylists from '../shared/modal/ModalEditPlaylists';
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
const LayoutWithoutSideBar = ({ color }: { color?: string }) => {
  if (!color) color = 'bg-white';
  const { pathname } = useLocation();
  return (
    <div className="relative dark:bg-white flex-1">
      <NavBar />

      <div className={` ${color}`}>
        <motion.div key={pathname} initial="initial" animate="in" variants={pageVariants} transition={pageTransition}>
          <Outlet />
        </motion.div>
      </div>
      {/* <Footer /> */}
      <AudioPlayerMini />
      <ModalCreateNewPlaylist />
      <ModalEditPlaylists />
    </div>
  );
};

export default LayoutWithoutSideBar;
