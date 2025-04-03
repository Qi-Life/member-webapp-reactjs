import { Suspense, useContext, useEffect } from 'react';
import { BrowserRouter, Outlet, RouteObject, useRoutes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import RequireAuth from './RequireAuth';
import NavBar from '~/components/shared/Nav/NavBar';
import Loading from '~/components/shared/Loading';
import Footer from '../shared/Footer/Footer';
import SideBarMenu from '../shared/SidebarMenu/SideBarMenu';
import ModalAddNewPlaylists from '../shared/modal/ModalAddNewPlaylists';
import ModalCreateNewPlaylist from '../shared/modal/ModalCreateNewPlaylist';
import ModalEditPlaylists from '../shared/modal/ModalEditPlaylists';
import ModalAddNewCustomFrequencies from '../shared/modal/ModalAddNewCustomFrequencies';
import ThankPayment from '../shared/SubscriptionForm/ThankPayment';
import { motion } from 'framer-motion';

import HomeScreen from '~/components/screens/Home';
import LoginScreen from '~/components/screens/Login';
import ProfileScreen from '~/components/screens/Profile';
import RegisterScreen from '~/components/screens/Register';
import ForgotScreen from '~/components/screens/Forgot';
import VideoScreen from '~/components/screens/Video';
import TutorialScreen from '~/components/screens/Tutorials';
import NotFoundScreen from '~/components/screens/NotFound';
import FavoritesScreen from '~/components/pages/favorites/FavoritesPage';
import FeaturedScreen from '~/components/pages/featuredPage/FeaturedPage';
import CustomFrequenciesScreen from '~/components/pages/custom-frequencies/CustomFrequencies';
import FrequenciesScreen from '~/components/pages/frequencies/Frequencies';
import PlaylistsScreen from '~/components/pages/playlists/PlayLists';
import MyPlaylistsScreen from '~/components/pages/my-playlists/MyPlayLists';
import PlaylistsItemScreen from '~/components/pages/playlistsItem/PlaylistsItem';
import MembersScreen from '~/components/pages/members/Members';
import PaymentScreen from '~/components/screens/Payment';
import PrivacyPolicy from '~/components/screens/PrivacyPolicy';
import Disclaimers from '~/components/screens/Disclaimers';
import TermsOfService from '~/components/screens/TermsOfService';
import ChangePasswordScreen from '~/components/screens/ChangePassword';
import NewPasswordScreen from '../screens/NewPasswordScreen';
import CustomFrequenciesDetail from '~/components/pages/custom-frequencies/CustomFrequenciesDetail';


import InnerFrequencyScreen from '~/components/pages/inner-frequency/InnerFrequency';
import SearchScreen from '../screens/Search';
import { AuthContext } from '../context/AppProvider';
import NotificationDetail from '../pages/notifications/NotificationDetail';
import HandleChatMessage from '../screens/HandleChatMessage';
import SilentScalar from '../screens/SilentScalar';
import AudioPlayerMini from '../shared/Audio/AudioPlayerMini';
import ChatbotComponent from '../shared/Chatbot/ChatbotComponent';
import NotFoundSubscription from '../shared/SubscriptionForm/NotFoundSubscription';
import IndividuaAlbum from '../pages/individual/IndividualAlbum';
import HolisticHealthLanding1 from '../pages/holistic-health/HolisticHealthLanding';
import HolisticHealth from '../pages/holistic-health/HolisticHealth';
import HolisticHealthResult from '../pages/holistic-health/HolisticHealthResult';
import MHolisticHeathLanding from '../pages/holistic-health/mobile/MHolisticHeathLanding';
import MHolisticHeath from '../pages/holistic-health/mobile/MHolisticHeath';
import MHolisticHeathResult from '../pages/holistic-health/mobile/MHolisticHeathResult';
import { isLogined } from '~/helpers/token';


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

function Layout() {
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
}

function LayoutwithoutSideBar({ color }: { color?: string }) {
  if (!color) color = 'bg-white';
  const { pathname } = useLocation();
  return (
    <div className="relative dark:bg-white flex-1">
      <NavBar />
      {/* <Alert /> */}

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
}


const HolictisLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = isLogined()// Example check for auth token
    if (!isLoggedIn) {
      return navigate('/login');
    }
  }, [navigate]);

  return (
    <div style={{ fontFamily: 'League Spartan, sans-serif', fontWeight: 300, marginBottom: '-100px', backgroundColor: '#ffffff' }}>
      <div className='absolute z-20 right-0 top-0 p-5  text-2xl md:text-3xl text-[#409f83] hover:opacity-0.8 cursor-pointer' onClick={()=> navigate('/')}>X</div>
      <Outlet />
    </div>
  );
};



const MHolictisLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = isLogined()// Example check for auth token
    if (!isLoggedIn) {
      return navigate('/login');
    }
  }, [navigate]);

  return (
    <div style={{ fontFamily: 'Lexend, sans-serif', fontWeight: 300, backgroundColor: '#ffffff', marginBottom: '-100px' }}>
      <div className='absolute right-0 top-0 p-5 text-2xl md:text-3xl text-[#409f83] hover:opacity-0.8 cursor-pointer' onClick={()=> navigate('/')}>X</div>
      <Outlet />
    </div>
  );
};




function Routes() {
  const routes: RouteObject[] = [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/masterwong-ai',
          element: (
            <HandleChatMessage />
          ),
        },
        {
          path: '/goback',
          element: (
            <div />
          ),
        },
        {
          path: '/silent-quantum',
          element: (
            <SilentScalar />
          ),
        },
        {
          index: true,
          element: (
            // <CheckAuth>
            <Navigate to="/starter-frequencies" />
            // </CheckAuth>
          ),
        },
        {
          path: '/starter-frequencies',
          element: (
            // <RequireAuth>
            <HomeScreen />
            // </RequireAuth>
          ),
        },
        {
          path: '/search',
          element: (
            // <RequireAuth>
            <SearchScreen />
            // </RequireAuth>
          ),
        },
        {
          path: '/favorites',
          element: (
            <RequireAuth>
              <FavoritesScreen />
            </RequireAuth>
          ),
        },
        {
          path: '/individual-albums',
          element: (
            <RequireAuth>
              <IndividuaAlbum />
            </RequireAuth>
          ),
        },
        {
          path: '/featured',
          element: <FeaturedScreen />,
        },
        {
          path: '/custom-frequencies',
          element: (
            <RequireAuth>
              <CustomFrequenciesScreen />
            </RequireAuth>
          ),
        },
        {
          path: '/frequencies/:categoryIdParam/:subcategoryIdparam',
          element: (
            // <RequireAuth>
            <FrequenciesScreen />
            // </RequireAuth>
          ),
        },
        {
          path: '/membership-frequencies/:categoryIdParam/:subcategoryIdparam',
          element: (
            // <RequireAuth>
            <FrequenciesScreen />
            // </RequireAuth>
          ),
        },
        {
          path: '/popular_playlist_list',
          element: <PlaylistsScreen />,
        },
        {
          path: '/playlists_list',
          element: (
            <RequireAuth>
              <MyPlaylistsScreen />
            </RequireAuth>
          ),
        },

        {
          path: '/profile',
          element: (
            <RequireAuth>
              <ProfileScreen />
            </RequireAuth>
          ),
        },
        {
          path: '/notifications/:id',
          element: (
            <RequireAuth>
              <NotificationDetail />
            </RequireAuth>
          ),
        },
        {
          path: '/member',
          element: (
            <RequireAuth>
              <MembersScreen />
            </RequireAuth>
          ),
        },

        {
          path: '*',
          element: <NotFoundScreen />,
        },
      ],
    },
    {
      path: '/payment',
      element: <LayoutwithoutSideBar />,
      children: [
        {
          index: true,
          element: (
            <PaymentScreen />
          ),
        },
      ],
    },

    {
      path: '/login',
      element: <LayoutwithoutSideBar />,
      children: [
        {
          index: true,
          element: <LoginScreen />,
        },
      ],
    },

    {
      path: '/register',
      element: <LayoutwithoutSideBar />,
      children: [
        {
          index: true,
          element: <RegisterScreen />,
        },
      ],
    },
    {
      path: '/forgot',
      element: <LayoutwithoutSideBar />,
      children: [
        {
          index: true,
          element: <ForgotScreen />,
        },
      ],
    },
    {
      path: '/video',
      element: <LayoutwithoutSideBar />,
      children: [
        {
          index: true,
          element: <VideoScreen />,
        },
      ],
    },
    {
      path: '/privacy-policy',
      element: <LayoutwithoutSideBar />,
      children: [
        {
          index: true,
          element: <PrivacyPolicy />,
        },
      ],
    },

    {
      path: '/disclaimer',
      element: <LayoutwithoutSideBar />,
      children: [
        {
          index: true,
          element: <Disclaimers />,
        },
      ],
    },

    {
      path: '/terms-and-condition',
      element: <LayoutwithoutSideBar />,
      children: [
        {
          index: true,
          element: <TermsOfService />,
        },
      ],
    },

    {
      path: '/inner_frequencies',
      element: <LayoutwithoutSideBar color="bg-white" />,
      children: [
        {
          index: true,
          element: <InnerFrequencyScreen />,
        },
      ],
    },
    {
      path: '/custom-frequencies-detail',
      element: <LayoutwithoutSideBar color="bg-white" />,
      children: [
        {
          index: true,
          element: <CustomFrequenciesDetail />,
        },
      ],
    },
    {
      path: '/tutorials',
      element: <LayoutwithoutSideBar />,
      children: [
        {
          index: true,
          element: <TutorialScreen />,
        },
      ],
    },
    {
      path: '/playlists',
      element: <LayoutwithoutSideBar />,
      children: [
        {
          index: true,
          element: <PlaylistsItemScreen name="myplaylist" />,
        },
      ],
    },
    {
      path: '/popular_playlists',
      element: <LayoutwithoutSideBar />,
      children: [
        {
          index: true,
          element: <PlaylistsItemScreen />,
        },
      ],
    },
    {
      path: '/change-password',
      element: <LayoutwithoutSideBar />,
      children: [
        {
          index: true,
          element: <ChangePasswordScreen />,
        },
      ],
    },
    {
      path: '/payment-success',
      element: <LayoutwithoutSideBar />,
      children: [
        {
          index: true,
          element: <ThankPayment />,
        },
      ],
    },
    {
      path: '/not-found-subscription',
      element: <LayoutwithoutSideBar />,
      children: [
        {
          index: true,
          element: <NotFoundSubscription />,
        },
      ],
    },
    {
      path: '/new-password',
      element: <LayoutwithoutSideBar />,
      children: [
        {
          index: true,
          element: <NewPasswordScreen />
          ,
        },
      ],
    },
    {
      path: '/holistic-health/landing',
      element: <HolictisLayout />,
      children: [
        {
          index: true,
          element: <HolisticHealthLanding1 />
          ,
        },
      ],
    },
    {
      path: '/holistic-health/start',
      element: <HolictisLayout />,
      children: [
        {
          index: true,
          element: <HolisticHealth />
          ,
        },
      ],
    },
    {
      path: '/holistic-health/result',
      element: <HolictisLayout />,
      children: [
        {
          index: true,
          element: <HolisticHealthResult />
          ,
        },
      ],
    },
    {
      path: '/holistic-health/m-landing',
      element: <MHolictisLayout />,
      children: [
        {
          index: true,
          element: <MHolisticHeathLanding />
          ,
        },
      ],
    },
    {
      path: '/holistic-health/m-start',
      element: <MHolictisLayout />,
      children: [
        {
          index: true,
          element: <MHolisticHeath />
          ,
        },
      ],
    },
    {
      path: '/holistic-health/m-result',
      element: <MHolictisLayout />,
      children: [
        {
          index: true,
          element: <MHolisticHeathResult />
          ,
        },
      ],
    },
  ];

  const element = useRoutes(routes);

  return <Suspense fallback={<Loading />}>{element}</Suspense>;
}

export default function Router() {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
}

