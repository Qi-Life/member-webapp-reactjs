import React, { useState, useEffect, useCallback, useContext } from 'react';
import SearchIcon from '~/components/shared/Icons/SearchIcon';
import { getFrequencies } from '~/services/FrequencyServices';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import FilterIcon from '~/components/shared/Icons/FilterIcon';
import SideBarMenuModal from '../../shared/SidebarMenu/SideBarMenuModal';
import LoadingButton from '~/components/LoadingButton';
import { AuthContext } from '~/components/context/AppProvider';
import SearchForm from '~/components/shared/SearchForm';

const SearchMenu = () => {
  const search = useLocation().search;
  const { setShowModal } = useContext(AuthContext);
  const location = useLocation();
  const sort = new URLSearchParams(search).get('sort');
  const { categoryIdParam, subcategoryIdparam } = useParams();
  const [, setSearchParams] = useSearchParams();
  const keyword = String(new URLSearchParams(search).get('keyword') ?? '');
  const [searchInput, setSearchInput] = useState(keyword);

  let limit = String(new URLSearchParams(search).get('limit') ?? '20');

  const id = String(new URLSearchParams(search).get('id') ?? '');
  const queryParams = new URLSearchParams(location.search);
  const page = Number.isNaN(parseInt(queryParams.get('page'), 10)) ? 1 : parseInt(queryParams.get('page'), 10);
  const categoryId = categoryIdParam || '';
  const subcategoryId = subcategoryIdparam || '';

  const categoryIdArray: string[] = categoryId.split(',');

  const [dataFrequencies, setDataFrequencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(Number.isNaN(page) ? '1' : String(page));
  const [totalRecord, setTotalRecord] = useState('0');

  const [statusChildMenu, setStatusChildMenu] = useState(false);

  const getDataFrequencies = async (pageNumber: string) => {
    try {
      setLoading(true);
      const res = await getFrequencies(keyword, categoryIdArray, subcategoryId, pageNumber, id, limit);
      if (res?.data?.frequencies === null) {
        setDataFrequencies([]);
        loadImage();
      } else {
        setDataFrequencies(res?.data?.frequencies);
        setTotalRecord(res?.data?.totalRecord);

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

  const handleChange = (e: any) => {
    // debouncedUpdate(e.target.value);
    if (e.target.value === '') {
      //   handleEnterSearch(e.target.value);
      setSearchParams('');
      setStatusChildMenu(false);
    } else {
      setStatusChildMenu(true);
    }
    setSearchInput(e.target.value);
  };

  const handleSearch = async (value: string) => {
    if (value === '') {
      setSearchParams('');
    } else {
      setSearchParams({ keyword: value.trim() });
    }
  };

  // Select Sort by
  const handleChangeSelect = (event: any) => {
    setSearchParams({ sort: event.target.value });
  };

  return (
    <>
      <div>
        <div className="w-full mb-5 md:flex hidden  px-4 md:items-center">
          <h3 className=" font-medium w-1/3 text-xl">Search</h3>
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
          </>
        )}

        <SideBarMenuModal />
      </div>
    </>
  );
};

export default SearchMenu;
