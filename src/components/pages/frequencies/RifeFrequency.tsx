import React, { useState, useEffect, useContext } from 'react';
import { getFrequencies } from '~/services/FrequencyServices';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import FilterIcon from '~/components/shared/Icons/FilterIcon';
import SideBarMenuModal from '../../shared/SidebarMenu/SideBarMenuModal';
import ScrollToTop from '~/components/ScrollToTop';
import { AppContext } from '~/components/context/AppProvider';
import { checkLockAlbum, getUnlockUrl, isLogined } from '~/helpers/token';
import NoResults from '~/components/NoResult';
import Heading from '~/components/shared/UI/Heading';
import LoadingWrapper from '~/components/shared/Loader/LoadingWraper';
import SearchForm from '~/components/shared/UI/SearchForm';
import Paginate from '~/components/shared/UI/Paginate';
import AlbumCard from '~/components/shared/UI/AlbumCard';

const RifeFrequency = () => {
    const navigate = useNavigate();
    const search = useLocation().search;
    const { statusScrollTop, setStatusScrollTop, setShowModal, setPathName } = useContext(AppContext);
    const location = useLocation();
    const [, setSearchParams] = useSearchParams();
    const keyword = String(new URLSearchParams(search).get('keyword') ?? '');
    let limit = Number(new URLSearchParams(search).get('limit') ?? '20');

    const id = Number(new URLSearchParams(search).get('id') ?? '');
    const [, setItemsPerPage] = useState(20);
    const queryParams = new URLSearchParams(location.search);
    const page = Number.isNaN(parseInt(queryParams.get('page'), 10)) ? 1 : parseInt(queryParams.get('page'), 10);
    const categoryId = 1;

    const [dataFrequencies, setDataFrequencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(Number.isNaN(page) ? '1' : String(page));
    const [totalPage, setTotalPage] = useState(0);
    const [totalRecord, setTotalRecord] = useState('0');

    // responsive paginate
    const [pageRange, setPageRange] = useState(5); // Set the initial value
    const [marginPages, setMarginPages] = useState(5);
    const { pathname } = useLocation();

    const getDataFrequencies = async (pageNumber: string) => {
        setPathName(pathname);
        try {
            setLoading(true);
            const res = await getFrequencies(keyword, ["1"], null, pageNumber, id, limit);

            if (res?.data?.frequencies === null) {
                setDataFrequencies([]);
                loadImage();
            } else {
                setDataFrequencies(res?.data?.frequencies);
                setTotalRecord(res?.data?.totalRecord);

                setTotalPage(getTotalPage(res?.data?.totalRecord));
                // setLoading(false);
                loadImage();
            }
        } catch (error) {
            setLoading(false);
        }
    };

    const loadImage = () => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    useEffect(() => {
        setDataFrequencies([]);
        getDataFrequencies(currentPage);
    }, [categoryId]);


    const getTotalPage = (totalRecord: number, perPage = +limit) => {
        const totalPages = Math.ceil(totalRecord / perPage);
        return totalPages;
    };


    const handleSearch = async (value: any) => {
        if (!!value) {
            navigate(`/search?keyword=${value}`);
        }
    };

    // Select Sort by
    const handleChangeSelect = (event: any) => {
        setSearchParams({ sort: event.target.value });
    };

    // click to play music
    const handleClickPlayItem = (item: any) => {
        let categoryId = item.categoryId || 1
        if (checkLockAlbum(item) && !isLogined()) {
            const unlockPageInfo = getUnlockUrl(item)
            window.location.href = unlockPageInfo.url
        } else {
            navigate(`/inner_frequencies?id=${item.id}&category=${categoryId}`);
        }
    };

    const handleItemsPerPageChange = async (perPage: number) => {
        const check = await getDataFrequencies(currentPage);
        if (check === undefined) {
            await getDataFrequencies('1');
            setSearchParams({ page: '1', limit: String(perPage) });
        } else {
            await getDataFrequencies(currentPage);
            setSearchParams({ page: String(currentPage), limit: String(limit) });
        }

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });

        setItemsPerPage(perPage);
        setCurrentPage('0');
    };

    const handlePageClick = (page: any) => {
        setCurrentPage(page);
        setSearchParams({ page: String(page), limit: String(limit) });
        getDataFrequencies(String(page) || '1');
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth < 640) {
                setPageRange(3);
                setMarginPages(2);
            } else if (screenWidth < 768) {
                setPageRange(4);
                setMarginPages(4);
            } else {
                setPageRange(6);
                setMarginPages(5);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleClickToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

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


    return (
        <div>
            <div className="w-full md:flex hidden justify-between items-center mb-[1.875rem]">
                <Heading level={1}> Rife Frequencies </Heading>
                <div className='md:w-1/3 ml-auto mr-[1rem]'>
                    <SearchForm onSearch={handleSearch} />
                </div>
                <button className='py-[1.1rem] px-[1.75rem] bg-primary text-white text-xl rounded-[4.375rem] flex items-center gap-[0.8rem]'>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 13L7 1M1 7H13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    Add</button>
            </div>
            <LoadingWrapper loading={loading}>
                <div className="md:hidden block mb-8">
                    <div className='md:w-1/3'>
                        <SearchForm onSearch={handleSearch} />
                    </div>
                    <button
                        type="button"
                        className="bg-[#409F83] h-10 w-full flex items-center relative rounded-md"
                        onClick={() => setShowModal(true)}
                    >
                        <span className="ml-2">
                            <FilterIcon />
                        </span>
                        <span className="text-white absolute left-1/2 -translate-x-1/2">Filter</span>
                    </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-[1.625rem]">
                    {dataFrequencies?.length > 0 ?
                        Array.from(dataFrequencies).map((item: any, index: number) => {
                            return (
                                <AlbumCard
                                    loading={loading}
                                    item={item}
                                    onClick={handleClickPlayItem}
                                    checkLocked={() => checkLockAlbum(item)}
                                    setLoading={setLoading}
                                />
                            );
                        }) : <NoResults />}
                </div>
                {dataFrequencies && totalPage > 1 && (
                    <div className="py-[1.5rem]">
                        <Paginate
                            limit={+limit}
                            totalPage={+totalPage}
                            page={+page}
                            totalRecord={+totalRecord}
                            pageRange={pageRange}
                            handlePageClick={handlePageClick}
                            handleItemsPerPageChange={handleItemsPerPageChange}
                        />
                    </div>
                )}
            </LoadingWrapper>
            <SideBarMenuModal />
            {statusScrollTop && (
                <div onClick={() => handleClickToTop()} className="fixed bottom-5 right-5">
                    <ScrollToTop />
                </div>
            )}
        </div>
    );
};

export default RifeFrequency;
