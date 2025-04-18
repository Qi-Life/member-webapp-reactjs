import React, { useEffect, useRef, useContext, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { FreaturedType } from '~/interface/components.interface';
import { getFeaturedAlbums } from '~/services/AlbumServices';
import { AppContext } from './context/AppProvider';

import AlbumCard from './shared/UI/AlbumCard';

const Featured = () => {
    const { dataFeatured, setDataFeatured, setInfoItem } = useContext(AppContext);
    const navigate = useNavigate();

    const getDataFeaturedAlbums = async () => {
        try {
            const resFeaturedAlbums = await getFeaturedAlbums();
            if (resFeaturedAlbums?.data?.featured_albums.length > 0) {
                setDataFeatured(resFeaturedAlbums?.data?.featured_albums);
            }
        } catch (error) { }
    };
    useEffect(() => {
        getDataFeaturedAlbums();
    }, []);

    const handleClickPlayItem = (item: any) => {
        setInfoItem(item);
        navigate(`/inner_frequencies?id=${item.id}&category=${item.categoryId}`);
    };


    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-[1.625rem]">
            {dataFeatured &&
                dataFeatured.map((item: FreaturedType, index: number) => {
                    return (
                        <AlbumCard
                            loading={false}
                            item={item}
                            onClick={handleClickPlayItem}
                        />
                    );
                })}
        </div>
    );
};

export default Featured;
