import { useContext, useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { AppContext } from '~/components/context/AppProvider';
import Router from '~/components/router/Router';
import { CiWifiOff } from 'react-icons/ci';
import { getToken } from 'firebase/messaging';
import { messaging } from '~/firebase';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { addDeviceTokenFCM } from '~/services/ProfileService';
import { getRifes } from '~/services/FrequencyServices';
import { getAlbums } from '~/services/AlbumServices';
import { getSilentScalarList } from '~/services/SilentScalarServices';
import { useAudio } from './context/AudioProvider';
import { isLogined, getAccessToken, getDataCategory, getDataSubCategory, setDataCategory, setDataSubCategory } from '~/helpers/token';
import { getAllCategories, getAllSubcategories } from '~/services/CategoryService';
import Logo from '~/assets/img/logo/qi-life-io-logo.png'

export default function App() {
    const { isMenuOpen, showModal, statusUser, handleOverlayClick } = useContext(AppContext) ?? {};
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const { playlists, isShowAdvancedMode } = useAudio();
    const [isLoading, setIsLoading] = useState(false);

    async function requestPermission() {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            const token = await getToken(messaging, {
                vapidKey: 'BNa8scTogKLWzm2DcI-_Qw-L_38mExrhktVL_KIU-HNokelwQ8pvyEvvqGjKBumiNxATeOR8Q91XF7HFvuh87NI',
            });

            if (localStorage.getItem('device_token') !== token || !localStorage.getItem('device_token')) {
                localStorage.setItem('device_token', token);
                await addDeviceTokenFCM({ os: 'web', token });
            }
        }
    }

    const initialData = async () => {
        try {
            if (getDataCategory().length == 0) {
                setIsLoading(true)
            }
            await Promise.all([
                getRifes('', 10000),
                getAlbums('', 1000),
                getSilentScalarList(),
                getAllCategories(),
                getAllSubcategories()
            ]).then(values => {
                localStorage.setItem('rifes', JSON.stringify(values[0].data?.frequencies));
                localStorage.setItem('albums', JSON.stringify(values[1].data?.album));
                let silentScalarsStore: any = [];
                values[2].data.data.forEach((item: any) => {
                    item.silent_energies.forEach((e: any) => silentScalarsStore.push(e));
                });
                localStorage.setItem('silentScalars', JSON.stringify(silentScalarsStore));
                setDataCategory(values[3]?.data.categories);
                setDataSubCategory(values[4].data.subcategories);
            });
        } catch (error) {
            console.error('Error initializing data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        initialData();
        requestPermission();

        const handleOnlineStatusChange = () => {
            setIsOnline(navigator.onLine);
        };

        window.addEventListener('online', handleOnlineStatusChange);
        window.addEventListener('offline', handleOnlineStatusChange);

        return () => {
            window.removeEventListener('online', handleOnlineStatusChange);
            window.removeEventListener('offline', handleOnlineStatusChange);
        };
    }, []);

    if (isLoading) {
        return (
            <div className="w-screen h-screen flex justify-center items-center bg-white">
                <div className="flex flex-col items-center">
                    <img src={Logo} alt="Logo" className="animate-bounce" />
                    <p className="text-lg font-semibold mt-4 loading-text">Loading...</p>
                </div>
                <style>
                    {`
          .loading-text {
            position: relative;
            color: black;
            font-weight: bold;
          }

          .loading-text::after {
            content: "Loading...";
            position: absolute;
            top: 0;
            left: 0;
            width: 0%;
            color: #059f83; /* Màu xanh */
            overflow: hidden;
            white-space: nowrap;
            animation: colorFill 2s infinite linear;
          }

          @keyframes colorFill {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}
                </style>
            </div>
        );
    }

    return (
        <div>
            {isOnline ? (
                <div
                    onClick={(e) => handleOverlayClick(e)}
                >
                    <HelmetProvider>
                        <Router />
                    </HelmetProvider>
                    <ToastContainer
                        position="top-right"
                        autoClose={2000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </div>
            ) : (
                <div className="w-screen h-screen flex justify-center flex-col items-center">
                    <CiWifiOff size={50} color="black" />
                    <p className="text-2xl text-black text-center mt-4 min-w-[300px] w-full">
                        Please check your internet connection and try again.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="border-clgreen p-2 border mt-10 rounded-md text-clgreen font-semibold bg-[#ECF5F4]"
                    >
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
}
