import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const HandleChatMessage: any = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const searchForItem = (items: any[], searchKeywords: string[], exactMatch: boolean = false): any => {
        return items.find(item =>
            searchKeywords.some(kw => exactMatch
                ? item.title.toLowerCase() === kw
                : item.title.toLowerCase().includes(kw)
            )
        );
    };

    const handleSearch = () => {
        const searchKeyword = searchParams.get("keyword");
        if (!searchKeyword) {
            return navigate('/starter-frequencies');
        }

        const searchKeywords = searchKeyword.toLowerCase().split(' ').filter((item: any) => item != '');

        let albums: any = localStorage.getItem('albums');
        let rifes: any = localStorage.getItem('rifes');

        if (albums) {
            albums = JSON.parse(albums);
            // Tìm kiếm chính xác
            let foundAlbum = searchForItem(albums, [searchKeyword.toLowerCase()], true);
            if (!foundAlbum) {
                // Nếu không tìm thấy chính xác, tìm kiếm từng từ
                foundAlbum = searchForItem(albums, searchKeywords);
            }
            if (foundAlbum) {
                return navigate(`/inner_frequencies?id=${foundAlbum.id}&category=${foundAlbum.categoryId}&type=recommend`);
            }
        }

        if (rifes) {
            rifes = JSON.parse(rifes);
            // Tìm kiếm chính xác
            let foundRife = searchForItem(rifes, [searchKeyword.toLowerCase()], true);
            if (!foundRife) {
                // Nếu không tìm thấy chính xác, tìm kiếm từng từ
                foundRife = searchForItem(rifes, searchKeywords);
            }
            if (foundRife) {
                return navigate(`/inner_frequencies?id=${foundRife.id}&category=1&type=recommend`);
            }
        }

        navigate('/starter-frequencies');
    };

    useEffect(() => {
        handleSearch();
    }, [searchParams, navigate]);
};

export default HandleChatMessage;
