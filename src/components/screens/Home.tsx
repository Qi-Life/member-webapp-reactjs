import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import _ from 'lodash';

import Featured from '../Featured';

import FreeFrequencies from '../FreeFrequencies';
import { getFreeAlbums } from '~/services/AlbumServices';
import SideBarMenuModal from '../shared/SidebarMenu/SideBarMenuModal';

import ScrollToTop from '../ScrollToTop';
import { AppContext } from '../context/AppProvider';

import Head from '../shared/UI/Head';
import LoadingWrapper from '../shared/Loader/LoadingWraper';
import Heading from '../shared/UI/Heading';


export default function HomeScreen() {
    const { search, pathname } = useLocation();

    const [loading, setLoading] = useState(false);
    const [dataFreeFrequencies, setDataFreeFrequencies] = useState([]);
    const keyword = String(new URLSearchParams(search).get('keyword') ?? '');
    const { statusScrollTop, setStatusScrollTop, setPathName } = useContext(AppContext);

    const getDataFreeFrequencies = async () => {
        setPathName(pathname);
        try {
            setLoading(true);
            const res = await getFreeAlbums(keyword || '');
            if (res?.data.free_albums.length > 0) {
                const basic_albums = res?.data.free_albums.map((item: any) => {
                    if (item.id != 5964) {
                        item.requiredLogin = true
                    }
                    return item
                })
                setDataFreeFrequencies(basic_albums);
                localStorage.setItem('album_free', res?.data.free_albums.map((item: any) => item.id).join(','));
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };


    useEffect(() => {
        getDataFreeFrequencies();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentPosition = window.scrollY;
            if (currentPosition >= 200) {
                setStatusScrollTop(true);
            } else {
                setStatusScrollTop(false);
            }
        };

        // Add event listener when component mounts
        window.addEventListener('scroll', handleScroll);

        // Clean up event listener when component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []); // Empty dependency array ensures the effect runs only once during component mount

    const handleClickToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <>
            <Head title="Home" />
            <LoadingWrapper loading={loading}>
                <div className='space-y-[1.87rem]'>
                    <div className='flex items-center justify-between  mb-[1.875rem]'>
                        <Heading level={1}>Welcome Back!</Heading>
                        <div className="relative">
                            <select
                                className="appearance-none focus:outline-none text-[#2A4C4F] font-semibold text-xl bg-[#2A4C4F]/20 px-[2.62rem] h-[3.375rem] rounded-[4.375rem] w-full"
                                value={0}
                            >
                                <option value={0}>Recommended</option>
                                <option value={1}>20</option>
                                <option value={2}>50</option>
                            </select>
                            <div className="pointer-events-none absolute right-[0.75rem] top-1/2 -translate-y-1/2">
                                <svg
                                    width="7"
                                    height="14"
                                    viewBox="0 0 12 8"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M1 1L6 6L11 1" stroke="#424847" strokeWidth="1.5" fill="#424847" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Heading level={2} className='mb-[1.25rem]'>Free</Heading>
                        <FreeFrequencies
                            dataFreeFrequencies={dataFreeFrequencies}
                        />
                    </div>
                    <div>
                        <Heading level={2} className='mb-[1.25rem]'>Featured</Heading>
                        <Featured />
                    </div>
                </div>
            </LoadingWrapper>
            <SideBarMenuModal />
            {statusScrollTop && (
                <div onClick={() => handleClickToTop()} className="fixed bottom-5 right-5">
                    <ScrollToTop />
                </div>
            )}

        </>
    );
}
