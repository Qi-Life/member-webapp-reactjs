import React, { useEffect, useState, useContext } from 'react';
import { Link, NavLink, useParams } from 'react-router-dom';

import { AuthContext } from '~/components/context/AppProvider';
import { getPlayList } from '~/services/PlaylistServices';
import { useNavigate } from 'react-router-dom';
import {
    getDataCategory,
    getAccessToken,
    getDataSubCategory,
    checkLockByCategory,
    getUnlockedCategory,
    isLogined,
} from '~/helpers/token';

import LeftIcon from '../../shared/Icons/LeftIcon';
import CategoryIcon from '../../shared/Icons/CategoryIcon';
import MembershipIcon from '../../shared/Icons/MembershipIcon';
import FavoriteIcon from '../../shared/Icons/FavoriteIcon';
import PlaylistIcon from '../../shared/Icons/PlaylistIcon';
import CustomizeIcon from '../../shared/Icons/CustomizeIcon';
import AdvancedMode from './AdvancedMode';

const SideBarMenuModal = () => {
    const { dataMyPlaylist, setDataMyPlaylist, userID, showModal, setShowModal, handleOverlayClick } = useContext(AuthContext);
    const [categories, setcategories] = useState<any>([]);
    const [subCategories, setsubCategories] = useState<any>([]);
    const [combinedData, setcombinedData] = useState<any>([]);
    const [filterCategoryGroup, setFitlerCategoryGroup] = useState<any>([])
    const [selectedCategory, setSelectedCategory] = useState<any>([])
    const navigate = useNavigate();
    const { categoryIdParam, subcategoryIdparam } = useParams()


    const groupPucharsedCategory = (categories: []) => {
        const unlocked_categories = getUnlockedCategory()
        const cats = categories.map((item: any) => {
            if (item.id == 7 || unlocked_categories.includes(item.id)) {
                return { ...item, is_purchased: true }
            }
            return { ...item, is_purchased: false }
        })
        return cats
    }

    const getSidebar = async () => {
        const cats = getDataCategory();
        const catGroup = groupPucharsedCategory(cats)
        setcategories(catGroup);
        const subs = getDataSubCategory();
        setsubCategories(subs);
    };

    const formatCategory = async () => {
        if (categories.length > 0 && subCategories.length > 0) {
            const combinedDataGet = categories.map((category: any) => {
                const categorySubcategories = subCategories.filter(
                    (subcategory: any) => subcategory.categoryId === category.id
                );
                return { ...category, subcategories: categorySubcategories };
            });
            setcombinedData(combinedDataGet);
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        getSidebar();
    }, []);
    useEffect(() => {
        formatCategory();
    }, [subCategories]);

    useEffect(() => {
        getMyPlaylist();
    }, [categories]);

    const getMyPlaylist = async () => {
        const resPlaylist = await getPlayList(userID);
        setDataMyPlaylist(resPlaylist?.data?.playlist);
    };

    const handleCheckboxChange = (categoryId?: string | number) => {
        if (categoryId == -1) {
            navigate('/individual-albums')
            closeModal();
        } else if (categoryId == 7) {
            navigate('/starter-frequencies')
            closeModal();
        } else {
            let newSelectedCategory: any = []
            if (selectedCategory.includes(categoryId)) {
                newSelectedCategory = selectedCategory.filter((item: any) => item != categoryId)
            } else {
                newSelectedCategory = [categoryId, ...selectedCategory].filter((item: any) => item != 7 && item != -1)
            }
            newSelectedCategory = [...new Set(newSelectedCategory)];
            setSelectedCategory(newSelectedCategory)
            const queryUrl = newSelectedCategory.join(',')
            navigate(`/frequencies/${queryUrl}/0`)
        }
    };

    useEffect(() => {
        const groupedItems = categories.reduce((acc: any, item: any) => {
            if (item.is_purchased) {
                acc.purchased.push(item);
            } else {
                acc.not_purchased.push(item);
            }
            return acc;
        }, { purchased: [], not_purchased: [] });
        setFitlerCategoryGroup(groupedItems)
    }, [categories])

    useEffect(() => {
        const pathname = window.location.pathname;
        if (pathname == '/starter-frequencies') {
            setSelectedCategory([7])
        } else if (pathname == '/individual-albums') {
            setSelectedCategory([-1])
        } else if (pathname.includes('/frequencies')) {
            const pathArr = pathname.split('/');
            const categoryString = pathArr[2].toString();
            setSelectedCategory([...categoryString.split(','), ...selectedCategory])
        }
    }, [window.location.pathname]);

    const handleOpenAllCate = (catId: string) => {
        navigate(`/frequencies/${catId}/all`)
        closeModal();
    }

    // const activeBgClasses = 'bg-[#ECF5F4] font-bold rounded-[10px]'

    return (
        <>
            <div
                onClick={(e) => handleOverlayClick(e)}
                className={`${showModal ? 'translate-x-0 visible' : 'translate-x-full invisible  '
                    } duration-200 ease-linear justify-center items-center flex overflow-x-hidden fixed  inset-0 z-50 outline-none focus:outline-none z-[998]`}
            >
                <div className="absolute bottom-0 left-0 mx-auto right-0 w-full h-[85%] bg-white">
                    <div
                        className="border-0 rounded-lg shadow-lg relative flex flex-col w-full overflow-y-scroll outline-none focus:outline-none"
                        style={{ height: '-webkit-fill-available' }}
                    >
                        <div className="flex items-start p-5 border-b border-solid border-blueGray-200 rounded-t">
                            <div className="w-[10%] cursor-pointer" onClick={closeModal}>
                                <LeftIcon />
                            </div>
                            <h3 className="text-base text-black text-center w-[90%]">Filter </h3>
                        </div>

                        <div className="relative p-3 flex-auto">
                            <div className="w-full flex">
                                <CategoryIcon />
                                <p className="m-1 text-base font-bold w-full text-black">Category</p>
                            </div>

                            <div className="w-full">
                                {combinedData.map((cate: any, index: number) =>
                                    (cate.subcategories.length == 0 || cate.id == 1 || cate.id == 7) ? (
                                        <>
                                            <ul>
                                                <li className={`px-4 py-2 text-sm `}>
                                                    <NavLink
                                                        to={`${cate.id === '7' ? '/starter-frequencies' : `/frequencies/${cate.id}/0`}`}
                                                        className="text-[#000]"
                                                        onClick={() => closeModal()}
                                                    >
                                                        {cate.name}
                                                    </NavLink>
                                                </li>
                                            </ul>
                                        </>
                                    ) : (
                                        <>
                                            <details>
                                                <summary className={`summary block px-4 py-2 relative cursor-pointer text-black ${cate.id === categoryIdParam ? 'active ' : 'text-[#000]'}`}>
                                                    <span onClick={() => handleOpenAllCate(cate.id)}>  {cate.name}</span>
                                                </summary>
                                                <ul className='pl-8 space-y-2 mt-1'>
                                                    {cate.subcategories.map((subItem: any, index: number) => (
                                                        <>
                                                            <li onClick={() => closeModal()} className={`pl-3 py-2 text-sm  hover:underline ${subItem.id === subcategoryIdparam ? 'active ' : 'text-[#000]'}`}>
                                                                <NavLink to={`/frequencies/${cate.id}/${subItem.id}`} className="text-[#000]">
                                                                    {subItem.name}
                                                                </NavLink>
                                                            </li>
                                                        </>
                                                    ))}
                                                </ul>
                                            </details>
                                        </>
                                    )
                                )}
                            </div>
                            <AdvancedMode handleClickLink={closeModal} />
                            <div className="mt-3 w-full flex items-center">
                                <MembershipIcon />
                                <p className="ml-1  text-base font-bold w-full">Membership</p>
                            </div>

                            <div className="mt-3 w-full grid gap-2">
                                {isLogined() &&
                                    Object.keys(filterCategoryGroup)?.map((key: string) => (
                                        <div className="mb-3 mx-2" key={key}>
                                            <details>
                                                <summary className='summary block px-2 text-base font-semibold  relative cursor-pointer'>
                                                    <h3
                                                        className={`mb-2 font-medium text-sm `}
                                                    >
                                                        {key === 'purchased' ? 'Purchased' : 'Unpurchased'}
                                                    </h3>
                                                </summary>
                                                <div className='mt-3 w-full grid gap-2 grid-cols-2'>
                                                    {filterCategoryGroup[key].map((c: any) => (
                                                        <button
                                                            className={
                                                                selectedCategory.includes(c.id)
                                                                    ? 'bg-[#409F83] rounded text-white font-medium  py-2'
                                                                    : 'bg-transparent hover:bg-[#409F83] text-black  ' +
                                                                    'text-[12px] hover:text-white py-2 px-4 border border-[#409F83] hover:border-transparent rounded overflow-hidden'
                                                            }
                                                            onClick={() => handleCheckboxChange(c.id)}
                                                        >
                                                            {c.name}
                                                        </button>
                                                    ))}
                                                    {key === 'purchased' && isLogined() && (
                                                        <button
                                                            className={
                                                                selectedCategory.includes(-1)
                                                                    ? 'bg-[#409F83] rounded text-white font-medium py-2'
                                                                    : 'bg-transparent hover:bg-[#409F83] text-black  ' +
                                                                    'text-[12px] hover:text-white py-2 px-4 border border-[#409F83] hover:border-transparent rounded overflow-hidden'
                                                            }
                                                            onClick={() => handleCheckboxChange(-1)}
                                                        >
                                                            Individual Albums
                                                        </button>
                                                    )}
                                                </div>
                                            </details>
                                        </div>
                                    ))}
                            </div>
                            {isLogined() && (
                                <>
                                    <div className="mt-3 w-full flex" onClick={() => closeModal()}>
                                        <FavoriteIcon />
                                        <NavLink to="/favorites" className=" px-2 text-base font-semibold relative cursor-pointer">
                                            Favorites
                                        </NavLink>
                                    </div>

                                    <div className="mt-3 w-full flex " onClick={() => closeModal()}>
                                        <PlaylistIcon />
                                        <NavLink
                                            to="/popular_playlist_list"
                                            className=" px-2 text-base font-semibold relative cursor-pointer"
                                        >
                                            Public Playlists
                                        </NavLink>
                                    </div>

                                    <div className="mt-3 w-full flex" onClick={() => closeModal()}>
                                        <CustomizeIcon />
                                        <NavLink
                                            to={!checkLockByCategory(1) ? '/custom-frequencies' : '/payment?paymentPlan=rifePlan'}
                                            className=" px-2 text-base font-semibold relative cursor-pointer"
                                        >
                                            Custom Frequencies
                                        </NavLink>
                                    </div>

                                    <div className="mt-3 w-full   ">
                                        <div className="flex" onClick={() => closeModal()}>
                                            <PlaylistIcon />
                                            <NavLink to="/playlists_list" className=" px-2 text-base font-semibold relative cursor-pointer">
                                                My Playlists
                                            </NavLink>
                                        </div>
                                        {dataMyPlaylist?.length > 0 ? (
                                            <>
                                                <ul className="pl-4">
                                                    {dataMyPlaylist.map((item: any, index: number) => {
                                                        return (
                                                            <li
                                                                key={index}
                                                                onClick={() => closeModal()}
                                                                className=" py-1 hover:underline duration-200 text-black  ease-linear flex item-center content-center justify-between"
                                                            >
                                                                <Link
                                                                    to={`/playlists?id=${item.id}`}
                                                                    className="block overflow-hidden overflow-ellipsis whitespace-nowrap  truncate mr-2 w-4/5"
                                                                >
                                                                    {item.name}
                                                                </Link>
                                                                <span>
                                                                    {item.private == 1 && (
                                                                        <svg
                                                                            className="h-4 w-4 text-zinc-600 ml-2"
                                                                            viewBox="0 0 24 24"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            stroke-width="2"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        >
                                                                            {' '}
                                                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />{' '}
                                                                            <circle cx="12" cy="7" r="4" />
                                                                        </svg>
                                                                    )}
                                                                </span>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex items-center justify-end px-6 py-3 border-t border-solid border-blueGray-200 rounded-b">
                            <button
                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showModal && <div className=" fixed inset-0 z-10 bg-black bg-opacity-25" onClick={closeModal} />}
        </>
    );
};

export default SideBarMenuModal;
