import React from 'react';

interface PaginateProps {
    limit: number;
    page: number;
    totalPage: number;
    pageRange: number,
    totalRecord?: number,
    handlePageClick: (arg: number) => void;
    handleItemsPerPageChange: (perPage: number) => void;
}

const Paginate = ({ limit, page, totalPage, pageRange, totalRecord, handlePageClick, handleItemsPerPageChange }: PaginateProps) => {
    const onChangePerpage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        handleItemsPerPageChange(+event.target.value)
    }

    return <div className="w-full flex justify-between items-center px-[2.5rem]">
        <div className='text-sm text-[#1B1C1B] text-opacity-[0.38]'>
            {(page - 1) * limit + 1}-{page * limit} of {totalRecord}
        </div>
        <div className="flex items-center justify-end flex-wrap">
            <button
                onClick={() => handlePageClick(Math.max(page - 1, 1))}
                disabled={page === 1}
                className="flex items-center justify-center w-[2.5rem] h-[2.5rem] border border-[#737877] rounded-full"
            >
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12L0 6L6 0L7.4 1.4L2.8 6L7.4 10.6L6 12Z" fill="#424847" />
                </svg>
            </button>
            <div className='flex mx-[0.75rem]'>
                {Array.from({ length: totalPage }, (_, i) => i + 1).map((p) => {
                    if (
                        p === 1 ||
                        // p === totalPage ||
                        (p >= page - pageRange && p <= page + pageRange)
                    ) {
                        return (
                            <button
                                key={p}
                                onClick={() => handlePageClick(p)}
                                className={`w-[2rem] h-[2.5rem] rounded-[6.25rem] text-[#00565B] text-sm font-medium ${p === page ? 'bg-[#00565B]/20' : ''
                                    }`}
                            >
                                {p}
                            </button>
                        );
                    }
                    // if (
                    //     (p === page - pageRange - 1 && p > 1) ||
                    //     (p === page + pageRange + 1 && p < totalPage)
                    // ) {
                    //     return (
                    //         <span
                    //             key={p}
                    //             className="mx-1 text-clgreen flex items-center justify-center h-9"
                    //         >
                    //             ...
                    //         </span>
                    //     );
                    // }
                    return null;
                })}
            </div>
            <button
                onClick={() => handlePageClick(Math.min(page + 1, totalPage))}
                disabled={page === totalPage}
                className="flex items-center justify-center  w-[2.5rem] h-[2.5rem] border border-[#737877] rounded-full"
            >
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg" className='scale-x-[-1]'>
                    <path d="M6 12L0 6L6 0L7.4 1.4L2.8 6L7.4 10.6L6 12Z" fill="#424847" />
                </svg>
            </button>
        </div>
        <label className="flex items-center gap-[0.75rem]">
            <div className="relative w-fit w-[4.19rem]">
                <select
                    className="appearance-none focus:outline-none border border-[#C2C8C6] rounded-[0.5rem] h-[2rem] px-[1rem] w-full"
                    value={limit}
                    onChange={onChangePerpage}
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
                <div className="pointer-events-none absolute right-[0.75rem] top-1/2 -translate-y-1/2">
                    <svg
                        width="8"
                        height="4"
                        viewBox="0 0 12 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M1 1L6 6L11 1" stroke="#424847" strokeWidth="1.5" fill="#424847" />
                    </svg>
                </div>
            </div>

            <span className="text-sm text-[#1B1C1B] text-opacity-[0.38]">
                Items per page:
            </span>
        </label>
    </div>

}

export default Paginate