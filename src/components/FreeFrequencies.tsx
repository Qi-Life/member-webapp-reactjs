import React from 'react';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';

import FeaturedFrequencies from './FeaturedFrequencies';
import { FreeFrequenciesType } from '~/interface/components.interface';
import AlbumCard from './shared/UI/AlbumCard';
import { isLogined } from '~/helpers/token';

interface FreeFrequenciesProps {
    dataFreeFrequencies: FreeFrequenciesType[];
}

const FreeFrequencies = ({ dataFreeFrequencies }: FreeFrequenciesProps) => {
    const navigate = useNavigate();

    const handleClickAlbum = (item: any) => {
        if (item?.requiredLogin && !isLogined()) {
            navigate('/register', { replace: true })
        } else {
            navigate(`/inner_frequencies?id=${item.id}&category=${item.categoryId}`)
        }
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-[1.625rem]">
            {dataFreeFrequencies &&
                dataFreeFrequencies?.map((item: FreeFrequenciesType, index: number) => {
                    return (
                        <AlbumCard
                            loading={false}
                            item={item}
                            onClick={handleClickAlbum}
                        />
                    );
                })}
        </div>
    );
};

export default FreeFrequencies;
