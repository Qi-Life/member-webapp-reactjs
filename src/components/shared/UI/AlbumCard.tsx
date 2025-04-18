import React from "react";
import { FaSpinner, FaLock } from "react-icons/fa";
import LazyImage from "../Loader/LazyImage";
import frequencyImage from '~/assets/img/image/frequency.png';
import Heading from "./Heading";
import { AlbumItem } from "~/interface/collection";

interface AlbumCardProps {
    item: AlbumItem;
    loading: boolean;
    onClick?: (item: AlbumItem) => void;
    checkLocked?: (item: AlbumItem) => boolean;
    setLoading?: (loading: boolean) => void;
}

const serverPath = 'https://apiadmin.qienergy.ai/assets/uploads/mp3'

const AlbumCard: React.FC<AlbumCardProps> = ({
    item,
    loading,
    onClick,
    checkLocked,
    setLoading
}) => {
    console.log(item.albumImage)
    return (
        <a
            onClick={() => onClick(item)}
            className="cursor-pointer"
        >
            {loading ? (
                <FaSpinner className="spinner-icon animate-spin mx-auto mt-[20%]" />
            ) : (
                <div className="relative mb-[0.93rem]">
                    {item?.albumImage ? (
                        <LazyImage
                            src={`${serverPath}/${item.id}/${item.albumImage}`}
                            alt="photo"
                            className="rounded-[1.25rem]"
                            onLoad={() => setLoading(false)}
                        />
                    ) : (
                        <LazyImage className="block rounded-[1.25rem]" src={frequencyImage} alt="photo" />
                    )}
                    {checkLocked && checkLocked(item) && (
                        <FaLock
                            size={20}
                            color="white"
                            className="absolute bottom-[5%] right-[5%] z-10"
                        />
                    )}
                    <div className='absolute flex items-center justify-center right-[0.875rem] top-[0.875rem] w-[1.87rem] h-[1.875rem] rounded-full'
                        style={{ background: 0 == 0 ? 'radial-gradient(circle, #DB3838 0%, #772727 100%)': '#757A7B'}}
                        >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.37988 2.61523C8.43826 1.37646 10.3493 0.865008 11.9258 1.83398L12.0771 1.93262L12.0781 1.93359C12.8756 2.47657 13.3928 3.38194 13.4844 4.34668L13.4971 4.54004C13.5399 5.72736 13.0427 6.83434 12.0312 8.08887C11.0127 9.35204 9.52651 10.7009 7.67969 12.3789L7.61035 12.4424L7.6084 12.4434C7.28884 12.7335 6.80659 12.7518 6.4668 12.4941L6.40137 12.4395L6.39844 12.4375L6.32129 12.3672L6.32031 12.3662L5.00488 11.1699C3.7604 10.0271 2.73498 9.03308 1.97168 8.08691C0.961463 6.83466 0.462488 5.72794 0.501953 4.54004C0.536231 3.56884 1.00618 2.63671 1.76562 2.04688L1.9209 1.93359H1.92188C3.52717 0.839205 5.52868 1.33776 6.62012 2.61523L7 3.05957L7.37988 2.61523Z" stroke="white" />
                        </svg>
                    </div>
                </div>
            )}
            <Heading level={3} className="mb-[0.5rem]">{item.title}</Heading>
            {item.description ? <p className="text-xs text-[#2A4C4F]">{item.description}</p> : <></>}
        </a>
    );
};

export default AlbumCard;
