import React, { useState, useEffect, useContext, useRef } from 'react';
import { useLocation, useNavigate, } from 'react-router-dom';
import { FaImage, FaLock, FaSpinner } from 'react-icons/fa';
import LoadingButton from '~/components/LoadingButton';
import BtnIconDes from '~/assets/img/btn-description.png'

import ScrollToTop from '~/components/ScrollToTop';
import { AppContext } from '~/components/context/AppProvider';
import LazyImage from '~/components/shared/Loader/LazyImage';

import Switcher from '../shared/Switcher';
import { getSilentScalarCoverImage, getSilentScalarList } from '~/services/SilentScalarServices';
import { useAudio } from '../context/AudioProvider';
import SideBarMenuModal from '../shared/SidebarMenu/SideBarMenuModal';
import { getPostList } from '~/services/PostServices';
import NotFoundResult from '../shared/NotFoundResult';
import FilterIcon from '../shared/Icons/FilterIcon';


interface Post {
    post_des: string;
    post_video: string;
}

const silent_quantum_tiers: any = { 'normal': "1", 'pro': "2", 'advanced': "3" }

const IframePostContainer = ({ post }: { post: any }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [iframeHeight, setIframeHeight] = useState(0);  // Track iframe height
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) return;

        // Adjust content injection
        const sanitizedContent = post?.post_des?.replace(/(<? *script)/gi, 'illegalscript') || "";
        const content = `
            <style>
                html, body {
                    margin: 0;
                    padding: 0;
                    overflow: hidden;  /* Prevent scrollbars inside iframe */
                    height: max-content; /* Allow content to expand */
                }
            </style>
            <div style="padding: 8px;">
                ${sanitizedContent}
            </div>
        `;

        iframeDoc.open();
        iframeDoc.write(content);
        iframeDoc.close();

        // Update iframe height based on its content
        const updateIframeHeight = () => {
            if (iframe && iframe.contentWindow) {
                const body = iframe.contentWindow.document.body;
                const html = iframe.contentWindow.document.documentElement;
                const height = Math.max(body.scrollHeight, body.offsetHeight, html.scrollHeight, html.offsetHeight);
                setIframeHeight(height);  // Set the new height of the iframe
            }
        };

        // Set an interval to check for content changes and update height
        const interval = setInterval(updateIframeHeight, 500); // Check every 500ms
        return () => clearInterval(interval);  // Cleanup interval on unmount
    }, [post]);

    return (
        <div
            className={`w-full relative ${isExpanded ? '' : 'h-[150px] sm:h-[200px]'}`}
            style={{
                transition: 'height 0.5s ease-in-out',
                height: isExpanded ? iframeHeight : '200px',  // Dynamically set height
            }}
        >
            <iframe
                ref={iframeRef}
                title="post content"
                style={{
                    width: '100%',
                    height: '100%', // Matches parent height
                    border: 'none',
                }}
                scrolling="yes"
            />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[-50px] ">
                <a
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="font-bold cursor-pointer text-[17px] py-2 text-black"
                    aria-expanded={isExpanded}
                >
                    {isExpanded ? 'See less' : 'See more'}
                </a>
            </div>
        </div>
    );
};


const SilentScalar = () => {
    const navigate = useNavigate();
    const {
        silentScalars,
        updateScalar, isShowAdvancedMode
    } = useAudio();
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search); // Parse the query string

    const { statusScrollTop, setShowModal } = useContext(AppContext);
    const [silentScalarsList, setSilentScalars] = useState([]);
    const [silentScalarsFilter, setSilentScalarsFilter] = useState([]);
    const [post, setPost] = useState<Post>({
        post_des: '',
        post_video: ''
    });

    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItemPreview, setCurrentItemPreview] = useState(Object);
    const [isExpandedPost, setIsExpandedPost] = useState(true)

    const silentTier = searchParams.get('tier') || 'normal';
    const silentListRef = useRef(null);

    const executeScrollToSilentView = () => silentListRef.current.scrollIntoView()

    const loadSilentScala = async () => {
        setLoading(true)
        const user_silent_tiers = localStorage.getItem('is_unlocked_scalar') ? localStorage.getItem('is_unlocked_scalar').split(',') : [];
        const maxSilentTier = Math.max(...user_silent_tiers.map((item: any) => +item)) || 0;

        const res = await getSilentScalarList(silentTier);
        if (res?.data?.data) {
            let _idsScalarPlay: any = []
            if (silentScalars) {
                _idsScalarPlay = silentScalars.map((item: any) => item.id)
            }
            let data = res.data.data.map((item: any) => {
                return {
                    ...item, silent_energies: [...item.silent_energies.map((_e: any) => {
                        return { ..._e, isPlay: _idsScalarPlay.includes(_e.id), isLocked: maxSilentTier < silent_quantum_tiers[item.energy_tier] }
                    })]
                }
            })
            setSilentScalars(data)
            setSilentScalarsFilter(data)
        }
        setLoading(false)
    };

    const handleClickToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleNavigatPayment = (item: any) => {
        switch (item.energy_tier) {
            case 'pro':
                navigate('/payment?paymentPlan=silentQuantumProPlan', {
                    state: { gobackUrl: window.location.href.replace(window.location.origin, '') }
                })
                break;
            case 'advanced':
                navigate('/payment?paymentPlan=silentQuantumAdvancedPlan', {
                    state: { gobackUrl: window.location.href.replace(window.location.origin, '') }
                });
                break
            default:
                navigate('/payment?paymentPlan=silentQuantumPlan', {
                    state: { gobackUrl: window.location.href.replace(window.location.origin, '') }
                });
        }
    }

    const handleOnOff = (isChecked: boolean, item: any) => {
        let oldSilentScalars = silentScalars || []
        if (item.isLocked && item.is_free != 1) {
            return handleNavigatPayment(item)
        }

        if (isChecked) {
            if (!oldSilentScalars.find((_item: any) => _item.id == item.id)) {
                updateScalar([item, ...oldSilentScalars])
            }
        } else {
            const newScalars = oldSilentScalars.filter((_item: any) => _item.id != item.id)
            updateScalar(newScalars)
        }
    }

    const handleClickFullItem = (item: any) => {
        if (item.isLocked && item.is_free != 1) {
            return handleNavigatPayment(item)
        }
    }

    const handleCollapsePost = () => {
        setIsExpandedPost(!isExpandedPost)
    }

    useEffect(() => {
        getPostList().then(({ data }) => {
            const postData = data?.data.find((item: any) => item.title == 'ScalarQuantum')
            if (postData) {
                setPost(postData)
            }
        })
    }, [])

    useEffect(() => {
        loadSilentScala()
    }, [silentTier]);


    useEffect(() => {
        if (!isShowAdvancedMode) {
            navigate('/')
        }
    }, [location, isShowAdvancedMode])

    useEffect(() => {
        executeScrollToSilentView()
    }, [searchParams.get('time')])


    const toggleImageModal = (item?: any) => {
        if (item) {
            setCurrentItemPreview(item)
        }
        setIsModalOpen(!isModalOpen);
    };

    const renderModal = () => {
        return (
            <div className='x'>
                {isModalOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[999] "
                        onClick={toggleImageModal}
                    >
                        <div
                            className="silent-modal relative w-[95%] sm:w-[600px] sm:max-h-[650px] max-h-screen bg-white rounded-[30px] shadow-lg animate-modal-slide py-[15px] sm:py-0"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div
                                onClick={toggleImageModal}
                                className="flex items-center justify-center w-[40px] h-[40px] text-xs bg-white font-semibold text-[#007660] rounded-full  right-0 absolute sm:right-[-20px] sm:right-[-30px] top-[-45px] sm:top-[-35px]">
                                <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_1323_302)">
                                        <path d="M14.4779 16.077C14.2997 16.2553 14.0881 16.3968 13.8552 16.4934C13.6222 16.5899 13.3726 16.6396 13.1204 16.6396C12.8683 16.6396 12.6186 16.5899 12.3857 16.4934C12.1528 16.3968 11.9411 16.2553 11.7629 16.077L7.52092 11.229L3.27892 16.075C2.91711 16.4263 2.43157 16.6212 1.92723 16.6176C1.42289 16.6139 0.940252 16.4119 0.583619 16.0553C0.226986 15.6986 0.0250013 15.216 0.0213154 14.7116C0.0176295 14.2073 0.212538 13.7218 0.563921 13.36L4.97692 8.31896L0.56292 3.27696C0.211538 2.91515 0.0166291 2.42961 0.020315 1.92527C0.0240009 1.42093 0.225986 0.938289 0.582619 0.581656C0.939251 0.225023 1.42189 0.0230381 1.92623 0.0193522C2.43057 0.0156663 2.91611 0.210575 3.27792 0.561958L7.52092 5.41196L11.7629 0.561958C11.9402 0.379388 12.1521 0.233891 12.3861 0.133927C12.6202 0.0339623 12.8717 -0.0184746 13.1262 -0.0203345C13.3807 -0.0221944 13.633 0.02656 13.8685 0.123093C14.104 0.219626 14.318 0.362011 14.4979 0.54197C14.6779 0.721928 14.8203 0.935868 14.9168 1.17135C15.0133 1.40683 15.0621 1.65915 15.0602 1.91365C15.0584 2.16814 15.0059 2.41972 14.906 2.65377C14.806 2.88781 14.6605 3.09965 14.4779 3.27696L10.0649 8.31896L14.4779 13.359C14.8383 13.7194 15.0408 14.2082 15.0408 14.718C15.0408 15.2277 14.8383 15.7165 14.4779 16.077Z" fill="#059F83" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_1323_302">
                                            <rect width="15.04" height="16.64" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                            <div className='pr-1'>
                                <div className='max-h-[70vh] overflow-y-auto'>
                                    <div className='sm:grid grid-cols-[1fr_2fr] py-[20px] sm:pt-[40px] px-2 sm:px-6 relative'>
                                        <div className="rounded sm:mr-[20px] w-1/2 mx-auto sm:w-[237px] sm:h-[237px] mb-2 sm:mb-5">
                                            {currentItemPreview.cover_image ? (
                                                <img
                                                    src={getSilentScalarCoverImage(currentItemPreview.cover_image)}
                                                    alt="photo"
                                                    className="w-full h-full object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex justify-center">
                                                    <FaImage size={100} className='h-96' />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col justify-between h-full sm:max-h-[232px]">
                                            <h2 className="text-lg font-bold mb-5 text-center sm:text-left uppercase sm:capitalize">{currentItemPreview.name}</h2>
                                            <div
                                                className="text-sm sm:overflow-hidden ml-2"
                                                dangerouslySetInnerHTML={{
                                                    __html: currentItemPreview.description,
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="w-full px-4 silent-scalar-body pb-4">
                                        <div
                                            className="text-sm sm:line-clamp-[16]"
                                            dangerouslySetInnerHTML={{
                                                __html: currentItemPreview.body,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderExpandButton = () => {
        return (
            <div
                className="absolute bottom-[10px] right-[30px] cursor-pointer"
                onClick={handleCollapsePost}
            >
                {!isExpandedPost ? (
                    <p className="">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="#409F83"
                            className="mx-auto text-gray-600"
                        >
                            <path d="M12 16l-6-6h12z" />
                        </svg>
                        <span className="font-semibold text-[#409F83]">Expand</span>
                    </p>
                ) : (
                    <p className="">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="#409F83"
                            className="mx-auto"
                        >
                            <path d="M12 8l6 6H6z" />
                        </svg>
                        <span className="font-semibold text-[#409F83]">Collapse</span>
                    </p>
                )}
            </div>
        )
    }


    return (
        <>
            <button
                type="button"
                className="bg-[#409F83] h-10 w-full flex items-center relative rounded-md mb-5 sm:hidden"
                onClick={() => setShowModal(true)}
            >
                <span className="ml-2">
                    <FilterIcon />
                </span>
                <span className="text-white absolute left-1/2 -translate-x-1/2">Filter</span>
            </button>
            <div>
                <div className="w-full mb-5 md:flex hidden h-[27px]">
                    <h3 className=" font-medium w-1/3 text-base lg:text-xl capitalize ">
                        Silent Quantum {`${silentTier != 'normal' ? silentTier : ''}`}
                    </h3>
                </div>
                <div className="md:hidden block">
                    <h3 className=" font-medium w-2/3 text-lg lg:text-xl mb-3 capitalize">
                        Silent Quantum {`${silentTier != 'normal' ? silentTier : ''}`}
                    </h3>
                </div>
                <div
                    className={`bg-white rounded-lg shadow-lg w-full mb-10 relative transition-all duration-500 ease-in-out ${isExpandedPost ? 'pt-5 sm:pt-[36px] pb-20 opacity-100' : 'px-5 py-5 max-h-[150px] opacity-90'
                        }`}
                >
                    {isExpandedPost ? (
                        <div className="sm:w-4/5 mx-auto">
                            <div className="video-container px-5 sm:px-20">
                                <iframe
                                    className="w-full rounded-lg shadow-md"
                                    src={post.post_video}
                                    title="YouTube video player"
                                    allowFullScreen
                                    style={{
                                        aspectRatio: '16/9',
                                        width: '100%',
                                    }}
                                ></iframe>
                            </div>
                            <IframePostContainer post={post} />
                        </div>
                    ) : (
                        <h2 className="font-bold text-md">Discover Silent Quantum Frequencies</h2>
                    )}
                    {renderExpandButton()}
                </div>

                <div className='' ref={silentListRef}>
                    {loading ? <LoadingButton /> :
                        <>
                            {silentScalarsFilter.length > 0 ?
                                Array.from(silentScalarsFilter).map((silent: any, index: number) => {
                                    return <div key={silent.id} >
                                        <h3 className='font-semibold text-base'>{silent.name}</h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full mx-auto mb-4">
                                            {
                                                silent.silent_energies.map((item: any) => {
                                                    return (
                                                        <div
                                                            key={item.id}
                                                            className="my-1.5 block cursor-pointer relative  "
                                                            onClick={() => handleClickFullItem(item)}
                                                        >
                                                            <div
                                                                className="block overflow-hidden px-4 xs:px-[1.5rem] mb-4 shadow-lg rounded-lg h-full bg-white"
                                                            >
                                                                {loading ? (
                                                                    <FaSpinner className="spinner-icon" />
                                                                ) : (
                                                                    <div className="relative block mt-[10%] xs:mt-[15%] h-auto w-full sm:w-4/5 rounded-md mx-auto">
                                                                        {!!item?.cover_image ? (
                                                                            <LazyImage
                                                                                src={getSilentScalarCoverImage(item.cover_image)}
                                                                                alt="photo"
                                                                                className="rounded-md"
                                                                                onLoad={() => setLoading(false)}
                                                                            />
                                                                        ) : (
                                                                            <LazyImage className="block " src={''} alt="photo" />
                                                                        )}
                                                                        {item.isLocked && +item.is_free != 1 && <FaLock className='absolute bottom-3 right-3 text-white' size={20} />}
                                                                        <img src={BtnIconDes} className='absolute top-2 right-2' onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            toggleImageModal(item)
                                                                        }} />
                                                                    </div>
                                                                )}
                                                                <header className="h-auto flex flex-col justify-center items-center">
                                                                    <h5 className="py-[10px] ">
                                                                        <span className="no-underline   hover:underline text-black font-semibold text-[17px]  block truncate ">
                                                                            {item.name}
                                                                        </span>
                                                                    </h5>
                                                                    <Switcher cb={handleOnOff} isChecked={item.isPlay || false} item={item} isLocked={item.isLocked && +item.is_free != 1} />
                                                                </header>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>
                                    </div>

                                })
                                : <NotFoundResult />
                            }
                        </>
                    }
                </div>
                <SideBarMenuModal />
                {renderModal()}
                {statusScrollTop && (
                    <div onClick={() => handleClickToTop()} className="fixed bottom-5 right-5">
                        <ScrollToTop />
                    </div>
                )}
            </div>
        </>
    );
};

export default SilentScalar;
