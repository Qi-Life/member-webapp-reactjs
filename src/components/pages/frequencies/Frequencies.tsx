import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBarMenuModal from '../../shared/SidebarMenu/SideBarMenuModal';

import ScrollToTop from '~/components/ScrollToTop';
import { AppContext } from '~/components/context/AppProvider';

import LoadingWrapper from '~/components/shared/Loader/LoadingWraper';
import { getFullCollections } from '~/services/AlbumServices';
import Heading from '~/components/shared/UI/Heading';
import AlbumCard from '~/components/shared/UI/AlbumCard';
import { AlbumItem, CategoryItem, SubItem } from '~/interface/collection';
import { checkLockAlbum, getUnlockUrl, isLogined } from '~/helpers/token';



const Frequencies = () => {
    const navigate = useNavigate();
    const { statusScrollTop, setStatusScrollTop } = useContext(AppContext);

    const [loading, setLoading] = useState(true);
    const [collections, setCollections] = useState([]);
    const [categoryActive, setCategoryActive] = useState(2)

    const getCollections = async () => {
        setLoading(true)
        let collectionResult = await getFullCollections()
        setCollections(collectionResult?.data?.data)
        setLoading(false)
    }


    const handleClickToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleClickCategory = (categoryId: number) => {
        setCategoryActive(categoryId)
    }

    const handleClickAlbum = (item: any) => {
        if (checkLockAlbum(item) && !isLogined()) {
            const unlockPageInfo = getUnlockUrl(item)
            window.location.href = unlockPageInfo.url
        } else {
            navigate(`/inner_frequencies?id=${item.id}&category=${categoryActive}`);
        }
    };

    useEffect(() => {
        getCollections()
    }, [])


    useEffect(() => {
        const handleScroll = () => {
            const currentPosition = window.scrollY;
            if (currentPosition >= 200) {
                setStatusScrollTop(true);
            } else {
                setStatusScrollTop(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const renderAlbums = (albums: AlbumItem[]) => {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-[1.625rem]">
                {
                    albums.map((albumItem: any) => {
                        return (
                            <AlbumCard
                                loading={loading}
                                item={{
                                    id: albumItem.albumId,
                                    title: albumItem.albumTitle,
                                    description: albumItem.description,
                                    albumImage: albumItem.albumImage
                                }}
                                onClick={handleClickAlbum}
                                // checkLocked={() => checkLockAlbum(item)}
                                setLoading={setLoading}
                            />
                        );
                    })
                }
            </div>
        )
    }

    return (
        <LoadingWrapper loading={loading}>
            <div className='flex flex-wrap gap-[0.625rem] mb-[1.625rem]'>
                {
                    collections?.map((item: CategoryItem) => {
                        const bg = categoryActive == item.categoryId ? 'bg-[#2A4C4F]' : 'bg-[#2A4C4F]/20';
                        const textColor = categoryActive == item.categoryId ? 'text-[#FFF]' : 'text-[#2A4C4F]';
                        return (
                            <div
                                className={`cursor-pointer px-[1.875rem] py-[0.93rem] ${bg} rounded-[4.375rem] text-xl text-semibold ${textColor}`}
                                onClick={() => handleClickCategory(item.categoryId)}
                            >
                                {item.title}
                            </div>
                        )
                    })
                }
            </div>
            <div className='space-y-[1.875rem]'>
                {
                    collections.find((item: CategoryItem) => item.categoryId == categoryActive)?.subcategories.map((subItem: SubItem) => {
                        return (
                            <div>
                                <Heading level={2} className='mb-[1.25rem]'>{subItem.subCategoryTitle}</Heading>
                                {renderAlbums(subItem.albums)}
                            </div>
                        )
                    })
                }
            </div>

            {statusScrollTop && (
                <div onClick={() => handleClickToTop()} className="fixed bottom-5 right-5">
                    <ScrollToTop />
                </div>
            )}
        </LoadingWrapper>
    );
};

export default Frequencies;
