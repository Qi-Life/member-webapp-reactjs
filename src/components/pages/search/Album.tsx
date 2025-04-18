import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { FaLock, FaSpinner } from 'react-icons/fa';
import LoadingButton from '~/components/LoadingButton';
import ReactPaginate from 'react-paginate';
import { getAlbums } from '~/services/AlbumServices';

const Album = () => {
  const navigate = useNavigate();
  const search = useLocation().search;
  const location = useLocation();
  const [, setSearchParams] = useSearchParams();
  const keyword = String(new URLSearchParams(search).get('keyword') ?? '');
  let limit = String(new URLSearchParams(search).get('limit') ?? 8);
  const queryParams = new URLSearchParams(location.search);
  const page = Number.isNaN(parseInt(queryParams.get('page'), 10)) ? 1 : parseInt(queryParams.get('page'), 10);
  

  const [dataFrequencies, setDataFrequencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(Number.isNaN(page) ? '1' : String(page));
  const [totalPage, setTotalPage] = useState(0);
  const [totalRecord, setTotalRecord] = useState('0');

  // responsive paginate
  const [pageRange, setPageRange] = useState(5); // Set the initial value
  const [marginPages, setMarginPages] = useState(5);

  const getDataFrequencies = async (pageNumber: string) => {
    try {
      setLoading(true);
      const res = await getAlbums(keyword, limit, pageNumber);
      if (res?.data?.frequencies === null) {
        setDataFrequencies([]);
        loadImage();
      } else {
        setDataFrequencies(res?.data?.album);
        setTotalRecord(res?.data?.total);

        setTotalPage(getTotalPage(res?.data?.total));
        loadImage();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const loadImage = () => {
    setTimeout(() => {
      setLoading(false);
    }, 1500); // Simulating a 2-second delay, replace with actual image loading logic
  };

  useEffect(() => {
    setDataFrequencies([]);
    getDataFrequencies(currentPage);
  }, [keyword]);

  const getTotalPage = (totalRecord: number, perPage = +limit) => {
    const totalPages = Math.ceil(totalRecord / perPage);

    return totalPages;
  };

  // click to play music
  const handleClickPlayItem = (item: any) => {
    navigate(`/inner_frequencies?id=${item.id}&category=${item.categoryId}`);
  };

  const handlePageClick = (data: any) => {
    const numberPage = data?.selected;
    setCurrentPage(numberPage + 1);
    setSearchParams({ limit: limit, keyword: keyword });
    getDataFrequencies(String(numberPage + 1) || '1');
  };

  // // responsive react pagirate
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

  return (
    <>
      <div>
        <div className="w-full md:flex  px-4  mt-5">
          <h3 className=" font-medium text-lg my-4">Result for Album</h3>
        </div>
        {loading ? (
          <div className="flex items-end justify-center">
            <LoadingButton />
          </div>
        ) : (
          <>
            <div className="flex flex-wrap flex-1  ">
              {dataFrequencies &&
                Array.from(dataFrequencies).map((item: any, index: number) => {
                  return (
                    <div key={index} className="my-1 p-2  w-full xs:w-1/2 md:px-4 lg:my-4  lg:w-1/3 xl:w-1/4 block  ">
                      <article className="overflow-hidden px-[1.5rem]  mb-[15px]  shadow-lg h-full bg-white rounded-lg">
                        <div className="relative">
                          {loading ? (
                            // Display spinner icon while the image is loading
                            <FaSpinner className="spinner-icon" />
                          ) : (
                            <img
                              src={item.image_path}
                              alt="photo"
                              className="block mt-[15%] h-auto w-[80%] sm:w-4/5 rounded-md mx-auto"
                              onClick={() => handleClickPlayItem(item)}
                              onLoad={() => setLoading(false)}
                            />
                          )}
                          {item.lock ? (
                            <FaLock size={20} color="white" className="absolute bottom-[5%] right-[20%] z-10" />
                          ) : (
                            <></>
                          )}
                        </div>

                        <header className="p-[10px] min-h-[55px] ">
                          <h5 className=" text-center md:mt-[10px] mb-[5px] ">
                            <span className="no-underline hover:underline text-black font-semibold text-[17px]  block truncate cursor-default">
                              {item?.title}
                            </span>
                          </h5>
                        </header>
                      </article>
                    </div>
                  );
                })}
            </div>
            {dataFrequencies && Array.from(dataFrequencies).length !== 0 ? (
              <div className="flex flex-col-reverse items-end xl:flex-row  ">
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
                    forcePage={+currentPage - 1}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center">Album not found</div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Album;
