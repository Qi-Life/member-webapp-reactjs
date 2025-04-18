import React, { useEffect, useState, useContext } from 'react';
import { NavLink, useNavigate, useLocation, useParams } from 'react-router-dom';


import logoIcon from 'assets/img/logo/qi-life-io-logo.png'

import homeIcon from 'assets/img/sidebar/home.png'
import quantumIcon from 'assets/img/sidebar/quantum.png'
import rifeIcon from 'assets/img/sidebar/rife.png'
import silentIcon from 'assets/img/sidebar/silent.png'
import favoriteIcon from 'assets/img/sidebar/favorite.png'
import collectionIcon from 'assets/img/sidebar/collection.png'
import playlistIcon from 'assets/img/sidebar/playlists.png'

import bgDefault from 'assets/img/sidebar/bg-0.png'
import bgActive from 'assets/img/sidebar/bg-1.png'

type MenuConfig = {
    id: number,
    name: string,
    active: boolean | number,
    icon: string,
    path: string
}

const menuConfigs: MenuConfig[] = [
    {
        id: 0,
        name: 'Home',
        active: 1,
        icon: homeIcon,
        path: '/'
    },
    {
        id: 1,
        active: 0,
        name: 'Quantum Frequencies',
        icon: quantumIcon,
        path: '/quantum'
    },
    {
        id: 2,
        active: 0,
        name: 'Rife Frequencies',
        icon: rifeIcon,
        path: '/rife-frequencies'
    },
    {
        id: 3,
        active: 0,
        name: 'Silent Quantum',
        icon: silentIcon,
        path: '/silent-quantum?tier='
    },
    {
        id: 4,
        active: 0,
        name: 'Favorites',
        icon: favoriteIcon,
        path: '/favorites'
    },
    {
        id: 5,
        active: 0,
        name: 'My Collections',
        icon: collectionIcon,
        path: '/playlists_list'
    },
    {
        id: 6,
        active: 0,
        name: 'Playlist',
        icon: playlistIcon,
        path: '/popular_playlist_list'
    },
]

const SideBarMenu = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const currentPath = location.pathname == '/starter-frequencies' ? '/' : location.pathname;

    return (
        <>
            <div className="bg-[#00565B] h-full pt-[2.5rem]">
                <div className="pl-[2.9rem] mb-[3.6rem]"><img src={logoIcon} alt="" /></div>
                <ul className="pl-[2.1rem] space-y-[2rem] text-xl semibold text-white">
                    {
                        menuConfigs.map((item: MenuConfig) => {
                            const isActive = currentPath === item.path || currentPath.startsWith(item.path + '?');

                            return (
                                <li className='flex items-center gap-[1rem] cursor-pointer' onClick={() => navigate(item.path)}>
                                    <span className="flex items-center justify-center bg-cover bg-center sm:w-[2.875rem] sm:h-[2.875rem]"
                                        style={{ backgroundImage: `url(${isActive ? bgActive : bgDefault})` }}><img src={item.icon} /></span>
                                    {item.name}
                                </li>
                            )
                        })
                    }

                </ul>
            </div>

            {/* Banner Links */}
            {/* <div className="container mx-auto mt-4 hover:opacity-80 cursor-pointer">
                    <a onClick={handleStartAssessment}>
                        <img alt="banner" className="w-full mx-auhref rounded-[5px]" src={HOLISTICBanner} />
                    </a>
                </div>
                <div className="container mx-auto mt-4 hover:opacity-80">
                    <a href="https://qilifestore.com/collections/qi-coils" target="_blank">
                        <img alt="banner" className="w-full mx-auhref rounded-[5px]" src={QiciolMaxBanner} />
                    </a>
                </div>
                <div className="container mx-auto mt-4 hover:opacity-80">
                    <a href="https://qilifestore.com/collections/education" target="_blank">
                        <img alt="banner" className="w-full mx-auhref rounded-[5px]" src={EducationBanner} />
                    </a>
                </div>
                <div className="container mx-auto mt-4 hover:opacity-80">
                    <a href="https://qilifestore.com/pages/qi-life-academy" target="_blank">
                        <img alt="banner" className="w-full mx-auhref rounded-[5px]" src={AcademyBanner} />
                    </a>
                </div>
                <div className="container mx-auto mt-4 hover:opacity-80">
                    <a href="https://qilifestore.com/pages/qi-life-center-license" target="_blank">
                        <img alt="banner" className="w-full mx-auhref rounded-[5px]" src={QiCenterBanner} />
                    </a>
                </div> */}
        </>
    );
};

export default SideBarMenu;
