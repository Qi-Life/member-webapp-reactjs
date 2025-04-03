import React, { useState, useEffect } from 'react';
import './ListItemAnimation.css';
import { getSilentScalarCoverImage } from '~/services/SilentScalarServices';

interface ListItemAnimationProps {
    items: any[];
}

const ListItemAnimation: React.FC<ListItemAnimationProps> = ({ items }) => {
    console.log("🚀 ~ items:", items)
    const [currentIndex, setCurrentIndex] = useState(0);
    const [_items, setItems] = useState<any[]>([]);
    const [animationClass, setAnimationClass] = useState('fade-in');

    useEffect(() => {
        try {
            const interval = setInterval(() => {
                setAnimationClass('fade-out');
                setTimeout(() => {
                    setCurrentIndex((prevIndex) => (prevIndex + 1) % _items.length);
                    setAnimationClass('fade-in');
                }, 200); // Duration of the fade-out animation
            }, 3000); // Change item every 3 seconds
            return () => clearInterval(interval);
        } catch (error) {
            console.log("🚀 ~ useEffect ~ error:", error)
        }
    }, [_items.length]);

    useEffect(() => {
        setCurrentIndex(0);
        setItems([...items]);
    }, [items]);

    return (
        <>
            {_items.length > 0 && (
                <div className={`list text-white ${animationClass}`}>
                    {_items[currentIndex]?.id === -1 ? (
                        <span className='font-semibold'>{_items[currentIndex].name}</span>
                    ) : (
                        <div className='flex gap-3'>
                            <div className='relative'>
                                {items.length > 1 && <div className="flex items-center justify-center w-[20px] text-xs h-[20px] bg-white font-semibold text-[#007660] rounded-full absolute right-[-10px] top-[-10px]">
                                    {items?.length}
                                </div>}
                                <img src={getSilentScalarCoverImage(_items[currentIndex].cover_image)} className='w-12 h-12 rounded object-cover' />
                            </div>
                            <div className='text-white text-[12px]'>
                                <p className='mb-1'>Silent Quantum <span className='capitalize'>{_items[currentIndex]?.energy_tier != 'normal' ? _items[currentIndex]?.energy_tier : ''}</span></p>
                                <p className='font-semibold'>{_items[currentIndex].name}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default ListItemAnimation;
