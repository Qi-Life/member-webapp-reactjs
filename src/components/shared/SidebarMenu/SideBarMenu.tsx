import React, { useEffect, useState, useContext } from 'react';
import { NavLink, useNavigate, useLocation, useParams } from 'react-router-dom';

import QiciolMaxBanner from '~/assets/img/banner/1. qicoil-max-scalar_300x250 admob.jpg';
import EducationBanner from '~/assets/img/banner/2. Education_300x250 admob.jpg';
import AcademyBanner from '~/assets/img/banner/3. qilife-academy_300x250 admob v1.jpg';
import QiCenterBanner from '~/assets/img/banner/4. qilifecenter_200x250 admob.jpg';
import HOLISTICBanner from '~/assets/img/banner/h_square_banner.jpg';

import { AuthContext } from '~/components/context/AppProvider';

import { checkLockByCategory, isLogined, getAccessToken, getDataCategory, getDataSubCategory, getUnlockedCategory } from '~/helpers/token';
import AdvancedMode from './AdvancedMode';

const unlocked_categories = getUnlockedCategory()

const SideBarMenu = () => {
    const { dataMyPlaylist, getMyPlaylist } = useContext(AuthContext);
    const [categories, setcategories] = useState<any>([]);
    const [subCategories, setsubCategories] = useState<any>([]);
    const [combinedData, setcombinedData] = useState<any>([]);
    const [filterCategoryGroup, setFitlerCategoryGroup] = useState<any>([])
    const [checkboxesMenu, setCheckboxesMenu] = useState<any>(Object);
    const location = useLocation();
    const navigate = useNavigate();

    const [openCategory, setOpenCategory] = useState<number | string>(null);
    const [isIndividualLink, setisIndividualLink] = useState(false);

    // Toggle submenu for a category
    const toggleSubmenu = (categoryId: number) => {
        setOpenCategory(openCategory === categoryId ? null : categoryId); // Toggle open/close
    };

    let { categoryIdParam, subcategoryIdparam } = useParams()

    const getSidebar = async () => {
        try {
            const ressub = getDataSubCategory();
            setsubCategories(ressub);
            const resCat = getDataCategory();
            const cats = resCat.map((item: any) => {
                if (item.id == 7 || unlocked_categories.includes(item.id)) {
                    return { ...item, is_purchased: true }
                }
                return { ...item, is_purchased: false }
            })
            setcategories(cats);
        } catch (error) { }
    };

    const formatCategory = () => {
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

    const handleMembershipCheckboxOnload = () => {
        let checkboxesMenuLoop = checkboxesMenu;
        const pathname = location.pathname;
        const parts = pathname.split('/');

        if (parts[1] === 'membership-frequencies') {
            const categoryIdParam = parts[2];
            if (categoryIdParam != '') {
                const categoryString = categoryIdParam.split(',');
                categoryString.forEach((value) => {
                    const checkboxKey = `checkbox${value}`;
                    checkboxesMenuLoop[checkboxKey] = true;
                });
                setCheckboxesMenu(checkboxesMenuLoop);
            } else {
                resetCheckBox(true)
            }

        } else {
            setCheckboxesMenu({})
        }

        if (parts[1] === 'individual-albums') {
            setisIndividualLink(true)
        }

        if (parts[1] === 'frequencies') {
            setOpenCategory(parts[2])
        }
    };

    useEffect(() => {
        getSidebar();
        handleMembershipCheckboxOnload()
    }, [location]);

    useEffect(() => {
        formatCategory();
        getMyPlaylist();
    }, [categories]);

    const handleCheckboxChange = (checkboxName: any) => {
        const checkBoxId = checkboxName.replace(/\D/g, "");
        const isPurchasedCheckBox = filterCategoryGroup?.purchased.find((item: any) => item.id == checkBoxId)

        setisIndividualLink(false)
        let checkboxesMenuAdd = {
            ...checkboxesMenu,
            [checkboxName]: !checkboxesMenu[checkboxName],
        };
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const trueCheckboxIndices = Object.entries(checkboxesMenuAdd).reduce((acc, [key, value], index) => {
            if (value) {
                acc.push(+key.replace(/^\D+/g, ''));
            }
            return acc;
        }, [] as number[]);

        let checkBoxArr: any = [];
        if (isPurchasedCheckBox) {
            checkBoxArr = trueCheckboxIndices.filter((item: any) => item != 0 && filterCategoryGroup?.purchased.find((fItem: any) => fItem.id == item))
        } else {
            checkBoxArr = trueCheckboxIndices.filter((item: any) => item != 0 && !filterCategoryGroup?.purchased.find((fItem: any) => fItem.id == item))
        }

        Object.keys(checkboxesMenu).map((checkboxName: any) => {
            const checkBoxId = checkboxName.replace(/\D/g, "");
            if (!checkBoxArr.includes(checkBoxId.id)) {
                checkboxesMenuAdd[`checkbox${checkBoxId}`] = false
            }
        })

        if (checkBoxArr.length) {
            setCheckboxesMenu(checkboxesMenuAdd)
            navigate(`membership-frequencies/${checkBoxArr.join(',')}/0`);
        } else {
            resetCheckBox()
        }
    };

    const handleClick = () => {
        // Scroll to the top of the page with smooth behavior
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleClickIndividualLink = () => {
        if (!isIndividualLink) {
            navigate('/individual-albums')
            setCheckboxesMenu({})
        }
        setisIndividualLink(!isIndividualLink)
    }

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
    }, [categories, checkboxesMenu])

    const handleOpenAllCate = (catId: string) => {
        navigate(`/frequencies/${catId}/all`)
    }

    const handleStartAssessment = () => {
        navigate('/holistic-health/landing')
    }

    const checkMenuNoSub = (cate: any) => {
        const pathname = location.pathname;
        const parts = pathname.split('/');
        return (cate.id == categoryIdParam || (location.pathname == '/starter-frequencies' && cate.id == 7))
            && (parts[1] === 'frequencies' || parts[1] === 'starter-frequencies')
    }

    const checkMenuSub = (cate: any) => {
        const pathname = location.pathname;
        const parts = pathname.split('/');
        return cate.id === categoryIdParam && parts[1] === 'frequencies'
    }

    const resetCheckBox = (isHome: boolean = false) => {
        const defaultCheckboxes = Object.keys(checkboxesMenu).reduce((obj: any, key) => {
            obj[key] = false;
            return obj;
        }, {});
        setCheckboxesMenu(defaultCheckboxes)
        if (isHome) {
            setTimeout(() => { navigate('/starter-frequencies') }, 100)
        }
    }

    const checkMenuMembershipActive = (key: string): boolean => {
        if (location.pathname == '/individual-albums' && key == 'purchased') {
            return true
        }
        const r = filterCategoryGroup[key].some((item: any) =>
            checkboxesMenu[`checkbox${item.id}`] == true
        );
        return r
    };

    const activeBgClasses = 'bg-[#ECF5F4] font-bold rounded-[10px]'

    return (
        <>
            <div className="text-gray-600 min-h-screen hidden md:block h-full">
                <div className="container mx-auhref bg-white py-4 px-4 space-y-4 rounded-lg">
                    <details open>
                        <summary className="summary block text-base font-semibold  relative cursor-pointer text-black">
                            Filter by Category
                        </summary>
                        <ul>
                            {/* Loop through categories */}
                            {combinedData.map((cate: any, index: number) =>
                                (cate.subcategories.length == 0 || cate.id == 1 || cate.id == 7) ? (
                                    <li key={index} className={`px-2 py-2 text-sm ${checkMenuNoSub(cate) ? activeBgClasses : ''}`}>
                                        <NavLink
                                            to={`${cate.id === '7' ? '/starter-frequencies' : `/frequencies/${cate.id}/0`}`}
                                            className="text-[#000]"
                                            onClick={handleClick}
                                        >
                                            {cate.name}
                                        </NavLink>
                                    </li>
                                ) : (
                                    <li key={index}>
                                        <div
                                            className={`px-2 py-2 relative cursor-pointer text-[#000] ${checkMenuSub(cate) ? 'active ' + activeBgClasses : ''}`}
                                        >
                                            <a onClick={() => handleOpenAllCate(cate.id)}>{cate.name}</a>
                                            {/* Caret Icon */}
                                            <span
                                                onClick={() => toggleSubmenu(cate.id)}
                                                className={`absolute right-1 top-1/2 transform -translate-y-1/2 transition-transform ${openCategory === cate.id ? 'rotate-0' : '-rotate-90'}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M6 9l6 6 6-6" />
                                                </svg>
                                            </span>
                                        </div>
                                        {/* Subcategories (Only show when the category is open) */}
                                        <ul className={`pl-5 overflow-hidden transition-all ${openCategory === cate.id ? '' : 'max-h-0'}`}>
                                            {cate.subcategories.map((subItem: any, subIndex: number) => (
                                                <li key={subIndex} className={`w-full my-1 px-2 py-2 text-sm ${subItem.id === subcategoryIdparam ? 'active ' + activeBgClasses : 'text-[#000]'}`}>
                                                    <NavLink
                                                        to={`/frequencies/${cate.id}/${subItem.id}`}
                                                        className={`hover:text-clgreen hover:underline`}
                                                        onClick={handleClick}
                                                    >
                                                        {subItem.name}
                                                    </NavLink>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                )
                            )}
                        </ul>
                    </details>

                    {/* Advanced Mode */}
                    <AdvancedMode />

                    {/* Filter by Membership */}
                    <div>
                        <h3 className="block text-base font-semibold relative cursor-pointer mb-3 text-black">Filter by membership</h3>
                        <ul className="w-full">
                            {isLogined() &&
                                Object.keys(filterCategoryGroup)?.map((key: string) => (
                                    <div className="mb-3 mx-2" key={key}>
                                        <details open={checkMenuMembershipActive(key)}>
                                            <summary className='summary block px-2 text-base font-semibold  relative cursor-pointer'>
                                                <h3
                                                    className={`mb-2 font-medium text-sm ${checkMenuMembershipActive(key) ? 'text-green-600' : 'text-black-600'
                                                        }`}
                                                >
                                                    {key === 'purchased' ? 'Purchased' : 'Unpurchased'}
                                                </h3>
                                            </summary>
                                            {filterCategoryGroup[key].map((c: any) => (
                                                <li className="w-full h-[28px] my-[4px] ml-2" key={c.id}>
                                                    <div
                                                        onClick={() => handleCheckboxChange('checkbox' + c.id)}
                                                        className="flex items-center pl-2 my-[8px]"
                                                    >
                                                        <input
                                                            type="radio"
                                                            className="w-3 h-3 rounded-full"
                                                            checked={checkboxesMenu[`checkbox${c.id}`]}
                                                        />
                                                        <label
                                                            className={`w-full ml-2 font-medium text-sm cursor-pointer hover:underline duration-300 ease-linear ${checkboxesMenu[`checkbox${c.id}`] ? 'text-clgreen' : 'text-black'
                                                                }`}
                                                        >
                                                            {c.id === 7 ? 'Free' : c.name}
                                                        </label>
                                                    </div>
                                                </li>
                                            ))}
                                            {key === 'purchased' && isLogined() && (
                                                <li className="w-full ml-2" onClick={() => navigate('/individual-albums')}>
                                                    <div className="flex items-center pl-2 my-[8px]">
                                                        <input
                                                            type="radio"
                                                            className="w-3 h-3 rounded-full"
                                                            checked={location.pathname === '/individual-albums'}
                                                            onChange={handleClickIndividualLink}
                                                        />
                                                        <label
                                                            className={`w-full ml-2 font-medium text-sm cursor-pointer hover:underline duration-300 ease-linear ${location.pathname === '/individual-albums' ? 'text-clgreen' : 'text-black'
                                                                }`}
                                                        >
                                                            Individual Albums
                                                        </label>
                                                    </div>
                                                </li>
                                            )}
                                        </details>
                                    </div>
                                ))}
                        </ul>
                    </div>

                    {/* Conditional Links (Favorites, Custom Frequencies, etc.) */}
                    {isLogined() ? (
                        <div className="space-y-5">
                            <NavLink
                                to={isLogined() ? '/favorites' : '/login'}
                                className="block text-base font-semibold relative cursor-pointer text-black"
                                onClick={handleClick}
                            >
                                Favorites
                            </NavLink>
                            <NavLink
                                to={
                                    !isLogined()
                                        ? '/login'
                                        : !checkLockByCategory(1)
                                            ? '/custom-frequencies'
                                            : '/payment?paymentPlan=rifePlan'
                                }
                                className="block text-base font-semibold relative cursor-pointer text-black"
                                onClick={handleClick}
                            >
                                Custom Frequencies
                            </NavLink>
                            <NavLink
                                to={!isLogined() ? '/login' : '/popular_playlist_list'}
                                className="block text-base font-semibold relative cursor-pointer text-black"
                                onClick={handleClick}
                            >
                                Public Playlists
                            </NavLink>
                            <div>
                                <NavLink
                                    to={!isLogined() ? '/login' : '/playlists_list'}
                                    className="block text-base font-semibold relative cursor-pointer text-black mb-2"
                                    onClick={handleClick}
                                >
                                    My Playlists
                                </NavLink>
                                {dataMyPlaylist.length > 0 ? (
                                    <ul className="pl-4 pr-2">
                                        {dataMyPlaylist.slice(0, 5).map((item: any, index: number) => (
                                            <li key={index} className="py-1 break-all flex justify-between text-black">
                                                <NavLink
                                                    to={`/playlists?id=${item.id}`}
                                                    className="block overflow-hidden overflow-ellipsis truncate w-full hover:text-clgreen"
                                                >
                                                    {item.name}
                                                </NavLink>
                                                {item.private === 1 && (
                                                    <svg
                                                        className="h-4 w-4 text-zinc-600"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                        <circle cx="12" cy="7" r="4" />
                                                    </svg>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Banner Links */}
                <div className="container mx-auto mt-4 hover:opacity-80 cursor-pointer">
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
                </div>
            </div>
        </>
    );
};

export default SideBarMenu;
