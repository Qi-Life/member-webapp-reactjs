import React, { useState, useEffect, useCallback, useContext } from 'react';
import { getFrequencies } from '~/services/FrequencyServices';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import FilterIcon from '~/components/shared/Icons/FilterIcon';
import { FaLock, FaSpinner } from 'react-icons/fa';
import SideBarMenuModal from '../../shared/SidebarMenu/SideBarMenuModal';
import frequencyImage from '~/assets/img/image/frequency.png';
import ScrollToTop from '~/components/ScrollToTop';
import { AppContext } from '~/components/context/AppProvider';
import { checkLockAlbum, getUnlockUrl, isLogined } from '~/helpers/token';
import NoResults from '~/components/NoResult';
import Heading from '~/components/shared/UI/Heading';
import LazyImage from '~/components/shared/Loader/LazyImage';
import LoadingWrapper from '~/components/shared/Loader/LoadingWraper';
import SearchForm from '~/components/shared/UI/SearchForm';
import Paginate from '~/components/shared/UI/Paginate';

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

                <div className="md:hidden block">

                </div>

                <div className="flex flex-wrap w-full mx-auto  md:justify-start mt-4  ">
                    {dataFrequencies?.length > 0 ?
                        Array.from(dataFrequencies).map((item: any, index: number) => {
                            return (
                                <div
                                    key={index}
                                    className="my-1.5 w-1/2    px-2 lg:my-4  lg:w-1/3 xl:w-1/4 block cursor-pointer relative  "
                                >
                                    <a
                                        onClick={() => handleClickPlayItem(item)}
                                        className="block overflow-hidden px-4 xs:px-[1.5rem] mb-4 shadow-lg rounded-lg h-full bg-white"
                                    >
                                        {loading ? (
                                            // Display spinner icon while the image is loading
                                            <FaSpinner className="spinner-icon" />
                                        ) : (
                                            <div className="relative block mt-[10%] xs:mt-[15%] h-auto w-full sm:w-4/5 rounded-md mx-auto">
                                                {item?.image !== null && item?.image !== '' ? (
                                                    <LazyImage
                                                        src={`https://apiadmin.qienergy.ai/assets/uploads/mp3/${item.id}/${item.image}`}
                                                        alt="photo"
                                                        className=""
                                                        onLoad={() => setLoading(false)}
                                                    />
                                                ) : (
                                                    <LazyImage className="block " src={frequencyImage} alt="photo" />
                                                )}
                                                {checkLockAlbum(item) ? (
                                                    <FaLock size={20} color="white" className="absolute bottom-[5%] right-[5%] z-10" />
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        )}
                                        <header className="py-[10px] h-auto ">
                                            <h5 className=" text-center ">
                                                <span className="no-underline   hover:underline text-black font-semibold text-[17px]  block truncate ">
                                                    {item?.title}
                                                </span>
                                            </h5>
                                        </header>
                                    </a>
                                </div>
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
