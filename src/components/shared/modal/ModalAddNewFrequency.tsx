import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '~/components/context/AppProvider';
import { FaCircleDot } from 'react-icons/fa6';
import { GoDotFill } from 'react-icons/go';
import { useLocation } from 'react-router-dom';
import { AddFrequencytoPlaylist, getFrequencies, getMp3s, getRifes } from '~/services/FrequencyServices';
import { checkLockByCategory } from '~/helpers/token';
import LoadingButton from '~/components/LoadingButton';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';

import { toast } from 'react-toastify';
import { getAllCategories, getAllSubcategories } from '~/services/CategoryService';

const customStyles = {
    control: (provided: any) => ({
        ...provided,
        backgroundColor: '#fff',
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#047f69' : '#fff',
        '&:hover': {
            backgroundColor: '#ddd',
        },
    }),
};



const SelectCategory = ({ onChangeQueryTracks, isOpenNewFrequency, statusButton, categoryOptions, subCategories }: any) => {
    const [subCategoryOptions, setSubCategoryOptions] = useState<any>([]);
    const [categorySelected, setCategorySelected] = useState({ 'label': 'Select a category', value: null })
    const [subCategorySelected, setSubCategorySelected] = useState({ 'label': 'Select a subcategory', value: null })
    const [albumSelected, setAlbumSelected] = useState({ 'label': 'Select an album', value: null })
    const [albumOptions, setAlbumOptions] = useState<any>([]);
    
    const unlocked_subcategories = localStorage.getItem('subcategory_ids') ? localStorage.getItem('subcategory_ids').split(',').map(item => +item) : []


    const fetAlbums = async (inputValue: string = '') => {
        let albumsRes = await getFrequencies(inputValue, categorySelected?.value, subCategorySelected?.value)
        const albumOptions = albumsRes.data.frequencies.map((item: any) => {
            return { value: item.id, label: item.title }
        })
        setAlbumOptions(albumOptions)
        return albumOptions
    }

    const onChangeCategory = (categorySelected: any) => {
        setSubCategorySelected(null)
        setAlbumSelected(null)
        setCategorySelected(categorySelected)
    }

    const onChangeSubCategory = (subCategorySelected: any) => {
        setAlbumSelected(null)
        setAlbumOptions([])
        setSubCategorySelected(subCategorySelected)
    }

    const onChangeAlbum = (albumSelected: any) => {
        setAlbumSelected(albumSelected)
    }

    const albumPromiseOptions = async (inputValue: string) => {
        return new Promise<any[]>((resolve) => {
            setTimeout(() => {
                resolve(fetAlbums(inputValue));
            }, 1000);
        });
    }

    const clearSection = (targetName: string) => {
        switch (targetName) {
            case 'category':
                setCategorySelected(null);
                setSubCategorySelected(null);
                setAlbumSelected(null);
                break;
            case 'subcategory':
                setSubCategorySelected(null);
                setAlbumSelected(null);
                break;
            case 'album':
                setAlbumSelected(null);
                break;
        }
    }


    useEffect(() => {
        if (subCategories.length > 0 && categorySelected) {
            
            let subcategoryFilters = subCategories.filter((sub: any) => (sub.categoryId.split(',').includes(categorySelected.value)) || unlocked_subcategories.includes(sub.id))
            const subCategoryOptionValues = subcategoryFilters
                .map((item: any) => {
                    return { value: item.id, label: item.name }
                })
            setSubCategoryOptions(subCategoryOptionValues)
        }
    }, [categorySelected])


    useEffect(() => {
        onChangeQueryTracks(categorySelected, subCategorySelected, albumSelected)
    }, [categorySelected, subCategorySelected, albumSelected])

    useEffect(() => {
        fetAlbums()
    }, [categorySelected, subCategorySelected])

    useEffect(() => {
        if (!isOpenNewFrequency) {
            clearSection('category')
        }
    }, [isOpenNewFrequency])

    return (
        <div className=''>
            <div className='flex justify-between items-center gap-5 relative'>
                <Select options={categoryOptions}
                    value={categorySelected}
                    onChange={onChangeCategory}
                    className='mb-3 flex-grow'
                    placeholder="Select category"
                    styles={customStyles}
                />
                {categorySelected?.value && <button className='text-red-500 font-bold absolute' style={{ right: '-20px', top: '5px' }} onClick={() => clearSection('category')}>X</button>}
            </div>
            <div className='flex justify-between items-center  gap-5 relative'>
                <Select options={subCategoryOptions}
                    value={subCategorySelected}
                    onChange={onChangeSubCategory}
                    className='mb-3 flex-grow'
                    placeholder="Select subcategory"
                    styles={customStyles} />
                {subCategorySelected?.value && <button className='text-red-500 font-bold absolute' style={{ right: '-20px', top: '5px' }} onClick={() => clearSection('subcategory')}>X</button>}
            </div>
            <div className='flex justify-between items-center  gap-5 relative'>
                <AsyncSelect
                    loadOptions={albumPromiseOptions}
                    defaultOptions={albumOptions}
                    value={albumSelected}
                    onChange={onChangeAlbum}
                    className='mb-3 flex-grow'
                    placeholder="Select album"
                    styles={customStyles} />
                {albumSelected?.value && <button className='text-red-500 font-bold absolute' style={{ right: '-20px', top: '5px' }} onClick={() => clearSection('album')}>X</button>}
            </div>
        </div>
    )
}


const ModalAddNewFrequency = (props: any) => {
    const {
        isOpenNewFrequency,
        handleClickClose,
        handleOverlayClick,
        statusButton,
        setStatusButton,
    } = useContext(AppContext);
    const search = useLocation().search;
    const location = useLocation();
    const [isLoading, setLoading] = useState(false)
    const [addedItem, setAddedItem] = useState(undefined);
    const [isValid, setIsValid] = useState(true);
    const [inValidText, setInvalidText] = useState('');
    const [title, setTitle] = useState('');
    const [subcat, setSubCat] = useState(Object)
    const [defaultOptions, setDefaultOptions] = useState([]); // Default options for AsyncSelect
    const [categoryOptions, setCategoryOptions] = useState<any>([]);
    const [subCategories, setsubCategories] = useState<any>([]);

    let unlocked_categories = localStorage.getItem('category_ids') ? localStorage.getItem('category_ids').split(',').map(item => +item) : []

    unlocked_categories = unlocked_categories.concat(7)
    const unlocked_subcategories = localStorage.getItem('subcategory_ids') ? localStorage.getItem('subcategory_ids').split(',').map(item => +item) : []
    const unlocked_albums = localStorage.getItem('albums') ? JSON.parse(localStorage.getItem('albums')).map((item: any) => item.id) : []

    const initialSubCat = async () => {
        try {
            const categoryRes = await getAllCategories();
            
            const categoryOptionValues = categoryRes.data.categories.filter((item: any) => item.id != 1 && unlocked_categories.includes(+item.id))
                .map((item: any) => {
                    return { value: item.id, label: item.name }
                })
            setCategoryOptions(categoryOptionValues)
            const subCategoryRes = await getAllSubcategories();
            setsubCategories(subCategoryRes.data.subcategories)
        } catch (error) { }
    };

    const validateNumber = (value: any, min: any, max: any) => {
        return value >= min && value <= max;
    };

    const playlistId = String(new URLSearchParams(search).get('id') ?? '');

    // change status buttons
    const handleChangeStatusButtons = (btnType: string) => {
        if (btnType == 'custom') {
            setLoading(false)
        }
        setIsValid(false)
        setInvalidText('')
        setStatusButton(btnType);
        setTitle('')
        if (statusButton != 'album') {
            setSubCat({})
        }
    };

    const handleChangeHz = (e: any) => {
        // Assuming min and max are predefined values
        const min = 1;
        const max = 22000;
        const isValidNumber = validateNumber(e.target.value.trim(), min, max);
        setIsValid(isValidNumber);
        setAddedItem(e.target.value.trim());
        statusButton != 'custom' ? setTitle(e.target.value.trim()) : ''
    };

    const handleAddNewFrequency = async () => {
        try {
            let playlistItem;

            if (!isValid && statusButton == 'custom') {
                setIsValid(false)
                return setInvalidText('Please enter a number between 1 and 22000')
            }

            if (addedItem) {
                if (statusButton == 'rife') {
                    playlistItem = [{
                        title: title || `${addedItem.label}`,
                        value: addedItem.frequencies.split('/'),
                        frequency_type: 'rife',
                        key: addedItem.value
                    }]
                } else {
                    playlistItem = [{
                        title: title || 'custom',
                        value: [addedItem.value || addedItem],
                        key: statusButton == 'album' ? addedItem?.albumId : 'custom',
                        frequency_type: statusButton == 'album' ? 'mp3' : 'custom',
                    }]
                }
            } else {
                if (statusButton == 'album' && defaultOptions.length > 0) {
                    playlistItem = defaultOptions.map((item: any) => {
                        return {
                            title: subcat?.albumSelected?.label,
                            value: [item.value],
                            key: subcat?.albumId,
                            frequency_type: 'mp3',
                        }
                    })
                }
                if (!subcat?.albumSelected) {
                    return toast.error('Please select album first or frequency.')
                }
            }
            if (!playlistItem || !playlistItem.length) {
                return toast.error('Please select frequency to add.')
            }

            const res = await AddFrequencytoPlaylist({
                type: 'add',
                playlist_id: playlistId,
                playlistItem,
            });

            toast.success('Add frequency success')
            handleClickClose();
            await props.handleAdd();
        } catch (error) {
            handleClickClose();
            toast.error('Add frequency error')
        }
    };

    const onChangeMp3s = (item: any) => {
        if (item.value) {
            setIsValid(true)
            setAddedItem(item);
        }
    };

    useEffect(() => {
        fetchMp3s();
        getFrequencies();
        initialSubCat()
    }, [location.pathname]);


    const fetchMp3s = async (inputValue: string = '') => {
        if (subcat.categoryId || subcat.subId) {
            let mp3sRes = await getMp3s(inputValue, subcat)
            if (mp3sRes?.data?.length > 0) {
                let mp3s = subcat.albumId ? mp3sRes.data.filter((mp3: any) => mp3.frequency_id == subcat.albumId) : mp3sRes.data
                mp3s = mp3s.filter((m: any) => unlocked_albums.includes(m.frequency_id))
                const options = mp3s.map((item: any) => ({
                    value: item.id,
                    label: item.name,
                    albumId: item.frequency_id,
                }))
                setDefaultOptions(options); // Update default options
                return options
            }
        }
    }

    const getFrequencies = async (search: string = '') => {
        if (checkLockByCategory(1)) {
            return false
        }
        const frequencies = await getRifes(search);
        if (frequencies.data.frequencies.length > 0) {
            const options = frequencies.data.frequencies
                .map((item: any) => ({
                    value: item.id,
                    label: item.title,
                    frequencies: item.frequencies,
                }))
            return options
        }
    }

    const onchangeRife = (item: any) => {
        if (item.value) {
            setIsValid(true)
            setAddedItem(item);
            setTitle(item.label)
        }
    }

    const rifePromiseOptions = async (inputValue: string) =>
        new Promise<any[]>((resolve) => {
            setTimeout(() => {
                resolve(getFrequencies(inputValue));
            }, 1000);
        });

    const mp3PromiseOptions = async (inputValue: string) => {
        return new Promise<any[]>((resolve) => {
            setTimeout(() => {
                resolve(fetchMp3s(inputValue));
            }, 1000);
        });
    }

    const onChangeTitleInput = async (e: any) => {
        setTitle(e.target.value)
    }

    const onChangeQueryTracks = async (categorySelected: any, subCategorySelected: any, albumSelected: any) => {
        setSubCat({
            catId: categorySelected?.value,
            subId: subCategorySelected?.value,
            albumId: albumSelected?.value,
            albumSelected,
        })
        setAddedItem(null)
        if (!albumSelected?.value) {
            setTitle('')
        }else{
            setTitle(albumSelected?.label)
        }
    }

    useEffect(() => {
        fetchMp3s()
    }, [subcat])


    return (
        <div
            onClick={(e) => handleOverlayClick(e)}
            className={` ${isOpenNewFrequency ? 'w-screen min-h-screen h-full absolute top-0 bg-black bg-opacity-20  z-[9999]' : 'hidden'
                }   `}
        >
            <div
                className={`max-w-[500px] w-full z-10  duration-200 ease-linear  ${isOpenNewFrequency ? 'translate-y-1/4 opacity-100 visible ' : 'top-0 opacity-0 invisible'
                    } bg-white shadow-lg border border-gray rounded-md absolute top-0 left-1/2 -translate-x-1/2`}
            >
                <h1 className="text-center text-[#059f83] p-[15px] font-bold">Add Frequency To Playlist</h1>
                <hr />
                <div className="p-8">
                    <h3 className="font-bold">Choose Type</h3>
                    <div className="py-[10px] px-[15px] mb-[15px] flex items-center align-center">
                        <button
                            onClick={() => handleChangeStatusButtons('album')}
                            className={`mx-[7px] py-[3px] px-[10px] border rounded-md 
              font-bold flex items-center 
						${statusButton == 'album' ? 'bg-[#059f83] text-white }' : 'bg-white text-[#808080]'} `}
                        >
                            <GoDotFill size={20} />
                            Album
                        </button>
                        <button
                            onClick={() => handleChangeStatusButtons('rife')}
                            className={`mx-[7px] py-[3px] px-[10px] border rounded-md 
              font-bold flex items-center 
						${statusButton == 'rife' ? 'bg-[#059f83] text-white }' : 'bg-white text-[#808080]'} `}
                        >
                            <GoDotFill size={20} />
                            Rife
                        </button>
                        <button
                            onClick={() => handleChangeStatusButtons('custom')}
                            className={`mx-[7px] py-[3px] px-[10px] border rounded-md flex  font-bold  items-center ${statusButton == 'custom' ? 'bg-[#059f83] text-white }' : 'bg-white text-[#808080]'
                                } `}
                        >
                            <FaCircleDot className="mr-2" />
                            Custom
                        </button>
                    </div>
                    {statusButton == 'album' && <h3 className="font-bold mb-3">Select Album</h3>}
                    {statusButton == 'rife' && <h3 className=" font-bold mb-3">Select Rife</h3>}
                    {statusButton == 'custom' && <h3 className="font-bold  mb-3">Enter number</h3>}

                    <div className="relative inline-block  w-full  mb-3">
                        {isLoading && <LoadingButton />}
                        {statusButton == 'album' &&
                            <div className='p-2'>
                                <SelectCategory 
                                    onChangeQueryTracks={onChangeQueryTracks} 
                                    isOpenNewFrequency={isOpenNewFrequency}
                                    subCategories={subCategories}
                                    categoryOptions={categoryOptions}
                                />
                                <AsyncSelect
                                    loadOptions={mp3PromiseOptions}
                                    onChange={onChangeMp3s}
                                    cacheOptions
                                    defaultOptions={defaultOptions}
                                    placeholder='Select a track'
                                    value={addedItem}
                                    styles={customStyles} />
                            </div>
                        }
                        {statusButton == 'rife' && <AsyncSelect onChange={onchangeRife} loadOptions={rifePromiseOptions} cacheOptions defaultOptions />}
                        {statusButton == 'custom' && <div className="border-2 flex items-center w-full h-[34px] rounded-md overflow-hidden">
                            <input
                                value={addedItem}
                                type="number"
                                min={0}
                                className=" flex-1 h-full px-[6px] placeholder:text-[#333333] placeholder:font-medium rounded-sm outline-none"
                                onChange={(e) => handleChangeHz(e)}
                            />
                            <span className="leading-[34px] bg-[#888] font-medium  text-white border p-2 overflow-hidden ">
                                Hz
                            </span>
                        </div>}
                        {!isValid && <p style={{ color: 'red' }}>{inValidText}</p>}
                    </div>
                    <div className="flex flex-col mb-3">
                        <label className="mb-2 font-bold" htmlFor="name"> Custom Title</label>
                        <input
                            className="border border-gray outline-none p-1 h-[34px] rounded-sm"
                            type="text"
                            name="name"
                            id="name"
                            value={title}
                            onChange={onChangeTitleInput}
                            placeholder='Input a title'
                        />
                    </div>
                </div>

                <hr />
                <div className="flex items-center justify-end p-[15px]">
                    <button
                        onClick={() => {
                            handleClickClose();
                        }}
                        className="mx-1 h-[34px] px-[12px]  rounded-sm shadow-md  font-medium text-white bg-[#6C757D]"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => handleAddNewFrequency()}
                        className="mx-1 h-[34px] px-[12px]  rounded-sm shadow-md  bg-[#059f83] font-medium text-white"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalAddNewFrequency;
