/* global VoidFunction, JSX */
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import NavItem from '~/components/shared/Nav/NavItem';
import { getPlayList } from '~/services/PlaylistServices';

const funct = () => {}

export const AuthContext = createContext<any>({
  isMenuOpen: false,
  isOpenChild: false,
  dataMyPlaylist: [],
  getMyPlaylist: funct,
  setPathName: funct,
  setIsOpenChild:  funct,
});

function AppProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<any>(null);

  const [isOpen, setIsOpen] = useState<any>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isOpenNewFrequency, setIsOpenNewFrequency] = useState<any>(false);
  const [isOpenNewPlaylists, setIsOpenNewPlaylist] = useState<any>(false);
  const [isOpenEditPlaylists, setIsOpenEditPlaylist] = useState<any>(false);
  const [currentPlaylistEdit, setCurrentPlaylistEdit] = useState<any>(false);
  const [isOpenCreatePlaylist, setIsOpenCreatePlaylist] = useState<any>(false);
  const [statusPlayItem, setStatusPlayItem] = useState(false);
  const [loading, setLoading] = useState(false);
  const [infoItem, setInfoItem] = useState<any>();
  const [dataFreeFrequencies, setDataFreeFrequencies] = useState([]);
  const [dataMyPlaylist, setDataMyPlaylist] = useState([]);

  const [dataCustomFrequency, setDataCustomFrequency] = useState([]);
  const [dataFeatured, setDataFeatured] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [statusScrollTop, setStatusScrollTop] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [statusUser, setStatusUser] = useState(false);
  const [isOpenChild, setIsOpenChild] = useState<boolean>(false);
  const [statusButton, setStatusButton] = useState('album');
  const [pathName, setPathName] = useState('');
  const chatbot_thread = localStorage.getItem('chatbot_thread') || null
  const [chatbotThread, setChatbotThread] = useState(chatbot_thread);
  const [isShowChatbot, setIsShowChatBot] = useState(false);
  const [isPremium, setIsPremium] = useState(false)

  const handleClickAdd = () => {
    setIsOpen(!isOpen);
  };

  const handleClickAddNewFrequency = () => {
    setIsOpenNewFrequency(!isOpenNewFrequency);
    scrollToTop();
  };

  const handleClickEditPlaylists = (data: any) => {
    setIsOpenEditPlaylist(!isOpenEditPlaylists);
    setCurrentPlaylistEdit(data);
    scrollToTop();
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleOverlayClick = (e: any) => {
    if (e.target === e.currentTarget) {
      handleClickClose();
      setShowModal(false);
      setStatusUser(false);
      setIsMenuOpen(false);
    }
  };

  const handleClickClose = () => {
    setIsOpen(false);
    setIsOpenNewFrequency(false);
    setIsOpenEditPlaylist(false);
    setIsOpenNewPlaylist(false);
  };

  const handleClickAddNewPlaylist = () => {
    setIsOpenNewPlaylist(!isOpenNewPlaylists);
    scrollToTop();
  };

  const handleClickClosePlaylist = () => {
    setIsOpenNewPlaylist(false);
  };

  // modal create new playlist
  const handleClickCreatePlaylist = () => {
    setIsOpenCreatePlaylist(true);
  };

  const handleClickCloseCreatePlaylist = () => {
    setIsOpenCreatePlaylist(false);
  };

  const getMyPlaylist = async (search: any | '') => {
    const resPlaylist = await getPlayList(userID, search);
    if (resPlaylist?.data?.playlist.fetch_flag !== -1) {
      setDataMyPlaylist(resPlaylist?.data?.playlist);
    } else {
      setDataMyPlaylist([]);
    }
  };
  const userID = localStorage.getItem('id_user')?.match(/[0-9]+/)[0];

  const updateCurrentPlayList = (data: any) => {
    setCurrentPlaylistEdit(data);
  };

  useEffect(() => {
    let unlockedCat = localStorage.getItem('category_ids')
    let unlockedAlbums = localStorage.getItem('album_ids')
    let albumIdsFree = localStorage.getItem('album_free')
    let isUnlockedScalar = localStorage.getItem('is_unlocked_scalar')

    if (+isUnlockedScalar == 1) {
      return setIsPremium(true)
    }else if (unlockedCat && unlockedCat != 'null') {
      const catIds = unlockedCat.split(',').filter((item: any) => item && item.id != 7 && item != '' && item != 'null')
      if (catIds?.length) {
        return setIsPremium(true)
      }
    }else if (unlockedAlbums && albumIdsFree && unlockedAlbums != 'null' && albumIdsFree != 'null') {
      const albumIds_Arr: (string)[] = unlockedAlbums.split(',')
      const albumIdsFree_Arr: (string)[] = albumIdsFree.split(',')
      let invidualAlbumIds = albumIds_Arr.filter((item: any) => !albumIdsFree_Arr.includes(item.id))
      if (invidualAlbumIds.length > 0) {
        return setIsPremium(true)
      }
    }else{
      setIsPremium(false)
    }
  }, [localStorage.getItem('album_ids'), localStorage.getItem('is_unlocked_scalar')])

  const value = {
    userProfile,
    isPremium,
    isOpen,
    setIsOpen,
    isOpenNewPlaylists,
    handleClickAdd,
    handleClickClose,
    handleClickAddNewPlaylist,
    handleClickClosePlaylist,
    updateCurrentPlayList,
    infoItem,
    setInfoItem,
    isOpenCreatePlaylist,
    handleClickCloseCreatePlaylist,
    handleClickCreatePlaylist,
    dataFreeFrequencies,
    setDataFreeFrequencies,
    setDataMyPlaylist,
    dataMyPlaylist,
    dataCustomFrequency,
    setDataCustomFrequency,
    userID,
    dataFeatured,
    setDataFeatured,
    getMyPlaylist,
    handleClickAddNewFrequency,
    isOpenNewFrequency,
    currentPlaylistEdit,
    handleClickEditPlaylists,
    isOpenEditPlaylists,
    handleOverlayClick,
    loading,
    setLoading,
    statusPlayItem,
    setStatusPlayItem,
    setSearchInput,
    searchInput,
    isMenuOpen,
    setIsMenuOpen,
    statusScrollTop,
    setStatusScrollTop,
    showModal,
    setShowModal,
    setStatusUser,
    statusUser,
    isOpenChild,
    setIsOpenChild,
    statusButton,
    setStatusButton,
    setPathName,
    pathName,
    chatbotThread,
    setChatbotThread, isShowChatbot, setIsShowChatBot
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  return useContext(AuthContext);
}

function AuthStatus() {
  const auth = useAuth();
  const navigate = useNavigate();

  if (!auth.user) {
    return <NavItem href="/login">Sign in</NavItem>;
  }

  return (
    <p>
      Welcome {auth.user}!{' '}
      <button
        className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        onClick={() => {
          auth.signout(() => navigate('/'));
        }}
      >
        Sign out
      </button>
    </p>
  );
}

type RequireAuthProps = {
  children: JSX.Element;
};

function RequireAuth({ children }: RequireAuthProps) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.user) {
    // Redirect to the /login page, but save the current location.
    // This allows us to send user along to that page after they login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export { AppProvider, AuthStatus, RequireAuth, useAuth };
