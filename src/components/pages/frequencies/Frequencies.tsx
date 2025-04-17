import React, { useState, useEffect, useCallback, useContext } from 'react';
import { getFrequencies } from '~/services/FrequencyServices';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import FilterIcon from '~/components/shared/Icons/FilterIcon';
import { FaLock, FaSpinner } from 'react-icons/fa';
import SideBarMenuModal from '../../shared/SidebarMenu/SideBarMenuModal';
import frequencyImage from '~/assets/img/image/frequency.png';
import LoadingButton from '~/components/LoadingButton';
import ReactPaginate from 'react-paginate';
import ScrollToTop from '~/components/ScrollToTop';
import { AppContext } from '~/components/context/AppProvider';
import LazyImage from '~/components/shared/LazyImage';
import { checkLockAlbum, getUnlockUrl, isLogined } from '~/helpers/token';
import NoResults from '~/components/NoResult';
import SearchForm from '~/components/shared/SearchForm';

const Frequencies = () => {
  const navigate = useNavigate();
  const search = useLocation().search;
  const { statusScrollTop, setStatusScrollTop, setShowModal, setPathName } = useContext(AppContext);
  const location = useLocation();
  const sort = new URLSearchParams(search).get('sort');
  const { categoryIdParam, subcategoryIdparam } = useParams();
  const [, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState('');
  const keyword = String(new URLSearchParams(search).get('keyword') ?? '');
  let limit = String(new URLSearchParams(search).get('limit') ?? '20');

  const id = String(new URLSearchParams(search).get('id') ?? '');
  const [, setItemsPerPage] = useState(20);
  const queryParams = new URLSearchParams(location.search);
  const page = Number.isNaN(parseInt(queryParams.get('page'), 10)) ? 1 : parseInt(queryParams.get('page'), 10);
  const categoryId = categoryIdParam || '';
  const subcategoryId = subcategoryIdparam || '';

  const categoryIdArray: string[] = categoryId.split(',');

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
      let subCategoryQuery = subcategoryId
      if (subcategoryId == 'all') {
        subCategoryQuery = null;
      }
      const res = await getFrequencies(keyword, categoryIdArray, subCategoryQuery, pageNumber, id, limit);
      
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
    }, 1000); // Simulating a 2-second delay, replace with actual image loading logic
  };

  useEffect(() => {
    setDataFrequencies([]);
    getDataFrequencies(currentPage);
  }, [categoryId, subcategoryId]);

  const handleClick = (pageNumber: number) => {
    setCurrentPage(String(pageNumber) || '1');
    getDataFrequencies(String(pageNumber) || '1');
  };

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

  // click pagination]
  const handleItemsPerPageChange = async (e: any) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    limit = String(parseInt(e.target.value, 10));

    const check = await getDataFrequencies(currentPage);
    if (check === undefined) {
      await getDataFrequencies('1');
      setSearchParams({ page: '1', limit: limit });
    } else {
      await getDataFrequencies(currentPage);
      setSearchParams({ page: currentPage, limit: limit });
    }

    // handleClick(numberPage + 1);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    setItemsPerPage(newItemsPerPage);

    setCurrentPage('0'); // Reset to the first page when changing the number of items per page
    // Add your logic to fetch data for the new page with updated items per page
  };
  const handlePageClick = (data: any) => {
    const numberPage = data?.selected;
    setCurrentPage(numberPage + 1);
    setSearchParams({ page: numberPage + 1, limit: limit });
    getDataFrequencies(String(numberPage + 1) || '1');
    // handleClick(numberPage + 1);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    // scrollToTop();
  };

  // responsive react pagirate
  useEffect(() => {
    const handleResize = () => {
      // Adjust pageRange and marginPages based on the screen width
      const screenWidth = window.innerWidth;

      if (screenWidth < 640) {
        setPageRange(3); // Set a smaller value for smaller screens
        setMarginPages(2); // Adjust marginPages as needed
      } else if (screenWidth < 768) {
        setPageRange(4); // Set the default value for larger screens
        setMarginPages(4); // Adjust marginPages as needed
      } else {
        setPageRange(6); // Set the default value for larger screens
        setMarginPages(5); // Adjust marginPages as needed
      }
    };

    // Attach the event listener for window resize
    window.addEventListener('resize', handleResize);

    // Call handleResize once to set the initial values
    handleResize();

    // Cleanup the event listener on component unmount
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

    // Add event listener when component mounts
    window.addEventListener('scroll', handleScroll);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getSubTitle = () => {
    if(categoryId == "1") {
      return ''
    }else if(subcategoryId == 'all'){
      return 'All'
    }
    else{
      const subs = localStorage.getItem('useDataSubCategory') ? JSON.parse(localStorage.getItem('useDataSubCategory')): []
      if(subs.length){
        const currentSub = subs.find((s:any) => s.id == subcategoryId)
        return currentSub?.name
      }
    }
  }

  const getCategoryTitle = () => {
      const cats = localStorage.getItem('useDataCategory') ? JSON.parse(localStorage.getItem('useDataCategory')): []
      if(cats.length){
        const currentCat = cats.find((s:any) => s.id == categoryId)
        return currentCat?.name
      }
  }

  return (
    <>
      <div>
        <div className="w-full mb-10 md:flex hidden h-[27px] px-2 justify-between">
          <div className='heading'>
            <h1 className=" font-medium text-base lg:text-xl mb-3">
              {getCategoryTitle()}
            </h1>
            <p className='text-base font-medium text-sm' color='#1F2937'>{getSubTitle()}</p>
          </div>
          <div className='md:w-1/3'>
            <SearchForm onSearch={handleSearch} />
          </div>
          <div className="w-1/3 flex items-center">
            <span className="w-1/3  m-auto font-medium text-right mr-2 ">Sort by:</span>
            <select
              id="countries"
              className="w-2/3 text-sm rounded-md block px-2.5 outline-none h-[34px] border"
              onChange={handleChangeSelect}
              defaultValue={sort !== null ? sort : 'recent'}
            >
              <option selected value="recent">
                Recent
              </option>
              <option value="favourite">Favorite</option>
              <option value="recommended">Recommended</option>
            </select>
          </div>
        </div>
        {loading ? (
          <div className="h-[20vh] flex items-end justify-center">
            <LoadingButton />
          </div>
        ) : (
          <>
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
              <h3 className=" font-medium w-2/3 text-lg lg:text-xl mb-2 ">
                {categoryId === '1' ? 'Rife Frequencies' : getCategoryTitle()}
              </h3>
              <p className='text-sm font-medium' color='#1F2937'>{getSubTitle()}</p>
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
              <div className="flex flex-col-reverse items-end xl:flex-row  mt-10">
                <div className="w-full ">
                  <ReactPaginate
                    previousLabel="<<"
                    nextLabel=">>"
                    breakLabel={'...'}
                    pageCount={totalPage}
                    marginPagesDisplayed={marginPages}
                    pageRangeDisplayed={pageRange}
                    onPageChange={handlePageClick}
                    containerClassName="flex items-center w-full justify-end "
                    pageClassName="border  mx-1 text-clgreen "
                    pageLinkClassName="font-semibold inline-block h-9 min-w-[30px]  flex justify-center items-center"
                    nextClassName="border round-sm text-clgreen font-semibold "
                    nextLinkClassName="h-9 min-w-[30px] w-auto inline-block flex items-center justify-center hover:opcity-90 ducation-200"
                    previousClassName="border  text-clgreen font-semibold "
                    previousLinkClassName="h-9 min-w-[30px] w-auto inline-block flex items-center justify-center hover:opcity-90 ducation-200"
                    breakClassName="text-clgreen"
                    activeClassName="border-2 border-clgreen"
                    forcePage={page - 1}
                  />
                </div>

                <label className="flex items-center ml-2 font-medium mb-2 xl:mb-0">
                  <span className="inline-block text-clgreen min-w-[130px] w-auo">Albums per page:</span>
                  <select
                    className="h-9 min-w-[40px] border text-clgreen focus:outline-none"
                    value={limit}
                    onChange={(e) => handleItemsPerPageChange(e)}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </label>
              </div>
            )}
          </>
        )}

        <SideBarMenuModal />
        {statusScrollTop && (
          <div onClick={() => handleClickToTop()} className="fixed bottom-5 right-5">
            <ScrollToTop />
          </div>
        )}
      </div>
    </>
  );
};

export default Frequencies;
