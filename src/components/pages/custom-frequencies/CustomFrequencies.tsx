import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '~/components/context/AppProvider';
import SearchIcon from '~/components/shared/Icons/SearchIcon';
import AddIcon from '~/assets/img/img_card_plus.png';
import bannerFooter from '~/assets/img/qc-max-admob-horizontal.jpg';
import FilterIcon from '~/components/shared/Icons/FilterIcon';
import { deleteCustomFrequencies, getCustomFrequencies } from '~/services/CustomFrequencyServices';
import photoItem from '~/assets/img/image/frequency.png';
import { Link, useNavigate } from 'react-router-dom';
import LoadingButton from '~/components/LoadingButton';
import { checkLockByCategory } from '~/helpers/token';
import SideBarMenuModal from '~/components/shared/SidebarMenu/SideBarMenuModal';
import ScrollToTop from '~/components/ScrollToTop';

const CustomFrequencies = () => {
  const {
    handleClickAdd,
    dataCustomFrequency,
    setDataCustomFrequency,
    setStatusAlert,
    setMsgSuccess,
    statusScrollTop,
    setStatusScrollTop,
    setShowModal,
  } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [statusDel, setStatusDel] = useState(false);

  const navigate = useNavigate();
  const getDataCustomFreQuencies = async () => {
    try {
      const res = await getCustomFrequencies();
      setDataCustomFrequency(res.data[0]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  // click to play music
  const handleClickPlayItem = (item: any) => {
    navigate(`/custom-frequencies-detail?id=${item.id}&category=${item.categoryId}`);
  };

  const handleClickDel = async (id: string) => {
    try {
      if (confirm('Do you want to delete this custom frequencies ?') === true) {
        const resDel = await deleteCustomFrequencies(id);
        navigate('/custom-frequencies');
        setStatusDel(!statusDel);
        setStatusAlert(true);
        setMsgSuccess(resDel.data.rsp_msg);
        setTimeout(() => {
          setStatusAlert(false);
        }, 1500);
        const res = await getCustomFrequencies();
        setDataCustomFrequency(res.data[0]);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getDataCustomFreQuencies();
    if (checkLockByCategory(1)) {
      navigate('/payment?paymentPlan=rifePlan');
    }
  }, [statusDel]);

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

  return (
    <div>
      <div className="w-full  mb-5 sm:flex justify-between hidden h-[27px] px-2 ">
        <h3 className=" font-medium w-1/2 text-base lg:text-xl  ">Custom Frequencies</h3>
        <div className="flex w-1/3 items-center bg-white rounded-md pl-2 border h-[34px]">
          <SearchIcon w="16" h="16" />
          <input
            type="text"
            className="w-full h-full outline-none border-none text-sm rounded-md block px-2.5 placeholder:text-black placeholder:font-medium"
            placeholder="Search..."
          />
        </div>
      </div>
      <div className="sm:hidden block ">
        <div className="border border-[#9F9F9F] h-[34px] rounded-md w-full flex items-center relative my-4">
          <span className="ml-2">
            <SearchIcon w="28" h="28" />
          </span>
          <input
            type="text"
            className="font-light absolute left-0 pl-10  w-full h-full bg-transparent border-none outline-none  px-2 placeholder:text-[14px] placeholder:absolute placeholder:left-1/2 placeholder:-translate-x-1/2"
            placeholder="Search"
          />
        </div>
        <button
          type="button"
          className="bg-[#409F83] h-[34px] w-full flex items-center relative rounded-md"
          onClick={() => setShowModal(true)}
        >
          <span className="ml-2">
            <FilterIcon />
          </span>
          <span className="text-white absolute left-1/2 -translate-x-1/2">Filter</span>
        </button>
        <h3 className=" font-medium w-full sm:w-1/2 text-base lg:text-xl  pl-4 mt-8 ">Custom Frequencies</h3>
      </div>

      {/* <h5 className="mt-4">{dataCustomFrequency.length === 0 ? 'No Record Found' : null}</h5> */}
      {loading ? (
        <>
          <LoadingButton />
        </>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            <>
              <div className="flex flex-wrap w-full mx-auto  md:justify-start mt-4  ">
                <div
                  className=" my-2  w-1/2 px-2 lg:my-4  lg:w-1/3  xl:w-1/4 block cursor-pointer"
                  onClick={() => handleClickAdd()}
                >
                  <div className="overflow-hidden  shadow-lg rounded-lg h-full min-h-[150px]  bg-white flex flex-col items-center justify-center">
                    <img className="block h-auto  w-1/2 max-w-[50px] cursor-pointer" src={AddIcon} alt="plus" />
                    <p className="text-center font-medium text-black">Add</p>
                  </div>
                </div>
                {dataCustomFrequency &&
                  dataCustomFrequency.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="my-1.5 w-1/2    px-2 lg:my-4  lg:w-1/3 xl:w-1/4 block cursor-pointer relative"
                    >
                      <Link
                        to={`/custom-frequencies-detail?id=${item.id}&category=${item.categoryId}`}
                        className="block overflow-hidden px-4 xs:px-[1.5rem] mb-4 shadow-lg rounded-lg h-full bg-white"
                      >
                        {!item?.image ? (
                          // eslint-disable-next-line camelcase
                          <img
                            alt="photo"
                            className="block mt-[10%] h-auto w-full sm:w-4/5 rounded-md mx-auto"
                            src={photoItem}
                          />
                        ) : (
                          <img
                            alt="photo"
                            className="block mt-[10%] xs:mt-[15%] h-auto w-full sm:w-4/5 rounded-md mx-auto"
                            src={item.image}
                          />
                        )}

                        <header className="py-[10px] h-auto ">
                          <h5 className=" text-center ">
                            <span className="no-underline   hover:underline text-black font-semibold text-[17px] block truncate ">
                              {item?.name ? item.name : 'No name'}
                            </span>
                          </h5>
                        </header>
                      </Link>
                      <svg
                        onClick={() => handleClickDel(item.id)}
                        className="z-10  h-8 w-8 p-1 text-red-500 absolute top-[4%] right-[14%] xs:top-[6%]  sm:top-[8%] sm:right-[16%] md:right-[21%] lg:right-[17%] cursor-pointer hover:opacity-90"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {' '}
                        <path stroke="none" d="M0 0h24v24H0z" /> <line x1="18" y1="6" x2="6" y2="18" />{' '}
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </div>
                  ))}
              </div>
            </>
          </div>
          <div className="mt-4">
            <img className="rounded-md" src={bannerFooter} alt="" />
          </div>
        </>
      )}
      <SideBarMenuModal />
      {statusScrollTop && (
        <div onClick={() => handleClickToTop()} className="fixed bottom-5 right-5">
          <ScrollToTop />
        </div>
      )}
    </div>
  );
};

export default CustomFrequencies;
