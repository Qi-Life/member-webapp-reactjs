import { Suspense } from 'react';
import { BrowserRouter, RouteObject, useRoutes, Navigate } from 'react-router-dom';
import RequireAuth from './RequireAuth';
import ThankPayment from '../shared/SubscriptionForm/ThankPayment';

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
import NotificationDetail from '../pages/notifications/NotificationDetail';
import HandleChatMessage from '../screens/HandleChatMessage';
import SilentScalar from '../screens/SilentScalar';
import NotFoundSubscription from '../shared/SubscriptionForm/NotFoundSubscription';
import IndividuaAlbum from '../pages/individual/IndividualAlbum';
import HolisticHealthLanding1 from '../pages/holistic-health/HolisticHealthLanding';
import HolisticHealth from '../pages/holistic-health/HolisticHealth';
import HolisticHealthResult from '../pages/holistic-health/HolisticHealthResult';
import MHolisticHeathLanding from '../pages/holistic-health/mobile/MHolisticHeathLanding';
import MHolisticHeath from '../pages/holistic-health/mobile/MHolisticHeath';
import MHolisticHeathResult from '../pages/holistic-health/mobile/MHolisticHeathResult';
import MainLayout from '../layout/MainLayout';
import LayoutWithoutSideBar from '../layout/LayoutWithoutSideBar';
import HolictisLayout from '../layout/HolictisLayout';
import MHolictisLayout from '../layout/MHolictisLayout';
import RifeFrequency from '../pages/frequencies/RifeFrequency';
import Loading from '../shared/Loader/Loading';

function Routes() {
    const routes: RouteObject[] = [
        {
            path: '/',
            element: <MainLayout />,
            children: [
                {
                    path: '/masterwong-ai',
                    element: <HandleChatMessage />,
                },
                {
                    path: '/goback',
                    element: <div />,
                },
                {
                    path: '/silent-quantum',
                    element: <SilentScalar />,
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
                    path: '/rife-frequencies',
                    element: (
                        <RifeFrequency />
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
            element: <LayoutWithoutSideBar />,
            children: [
                {
                    index: true,
                    element: <PaymentScreen />,
                },
            ],
        },

        {
            path: '/login',
            element: <LayoutWithoutSideBar />,
            children: [
                {
                    index: true,
                    element: <LoginScreen />,
                },
            ],
        },

        {
            path: '/register',
            element: <LayoutWithoutSideBar />,
            children: [
                {
                    index: true,
                    element: <RegisterScreen />,
                },
            ],
        },
        {
            path: '/forgot',
            element: <LayoutWithoutSideBar />,
            children: [
                {
                    index: true,
                    element: <ForgotScreen />,
                },
            ],
        },
        {
            path: '/video',
            element: <LayoutWithoutSideBar />,
            children: [
                {
                    index: true,
                    element: <VideoScreen />,
                },
            ],
        },
        {
            path: '/privacy-policy',
            element: <LayoutWithoutSideBar />,
            children: [
                {
                    index: true,
                    element: <PrivacyPolicy />,
                },
            ],
        },

        {
            path: '/disclaimer',
            element: <LayoutWithoutSideBar />,
            children: [
                {
                    index: true,
                    element: <Disclaimers />,
                },
            ],
        },

        {
            path: '/terms-and-condition',
            element: <LayoutWithoutSideBar />,
            children: [
                {
                    index: true,
                    element: <TermsOfService />,
                },
            ],
        },

        {
            path: '/inner_frequencies',
            element: <LayoutWithoutSideBar color="bg-white" />,
            children: [
                {
                    index: true,
                    element: <InnerFrequencyScreen />,
                },
            ],
        },
        {
            path: '/custom-frequencies-detail',
            element: <LayoutWithoutSideBar color="bg-white" />,
            children: [
                {
                    index: true,
                    element: <CustomFrequenciesDetail />,
                },
            ],
        },
        {
            path: '/tutorials',
            element: <LayoutWithoutSideBar />,
            children: [
                {
                    index: true,
                    element: <TutorialScreen />,
                },
            ],
        },
        {
            path: '/playlists',
            element: <LayoutWithoutSideBar />,
            children: [
                {
                    index: true,
                    element: <PlaylistsItemScreen name="myplaylist" />,
                },
            ],
        },
        {
            path: '/popular_playlists',
            element: <LayoutWithoutSideBar />,
            children: [
                {
                    index: true,
                    element: <PlaylistsItemScreen />,
                },
            ],
        },
        {
            path: '/change-password',
            element: <LayoutWithoutSideBar />,
            children: [
                {
                    index: true,
                    element: <ChangePasswordScreen />,
                },
            ],
        },
        {
            path: '/payment-success',
            element: <LayoutWithoutSideBar />,
            children: [
                {
                    index: true,
                    element: <ThankPayment />,
                },
            ],
        },
        {
            path: '/not-found-subscription',
            element: <LayoutWithoutSideBar />,
            children: [
                {
                    index: true,
                    element: <NotFoundSubscription />,
                },
            ],
        },
        {
            path: '/new-password',
            element: <LayoutWithoutSideBar />,
            children: [
                {
                    index: true,
                    element: <NewPasswordScreen />,
                },
            ],
        },
        {
            path: '/holistic-health/landing',
            element: <HolictisLayout />,
            children: [
                {
                    index: true,
                    element: <HolisticHealthLanding1 />,
                },
            ],
        },
        {
            path: '/holistic-health/start',
            element: <HolictisLayout />,
            children: [
                {
                    index: true,
                    element: <HolisticHealth />,
                },
            ],
        },
        {
            path: '/holistic-health/result',
            element: <HolictisLayout />,
            children: [
                {
                    index: true,
                    element: <HolisticHealthResult />,
                },
            ],
        },
        {
            path: '/holistic-health/m-landing',
            element: <MHolictisLayout />,
            children: [
                {
                    index: true,
                    element: <MHolisticHeathLanding />,
                },
            ],
        },
        {
            path: '/holistic-health/m-start',
            element: <MHolictisLayout />,
            children: [
                {
                    index: true,
                    element: <MHolisticHeath />,
                },
            ],
        },
        {
            path: '/holistic-health/m-result',
            element: <MHolictisLayout />,
            children: [
                {
                    index: true,
                    element: <MHolisticHeathResult />,
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
