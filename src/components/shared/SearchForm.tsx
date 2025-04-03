import React, { useState } from 'react';
import SearchIcon from './Icons/SearchIcon';

const SearchForm = ({ onSearch, className }: any) => {
    const [searchInput, setSearchInput] = useState('');

    // Handle input change
    const handleChange = (e: any) => {
        setSearchInput(e.target.value);
    };

    // Handle "Enter" key to submit search
    const handleSearch = (e: any) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent default form submission behavior
            handleSubmit(e); // Call search submit function
        }
    };

    // Submit the search (you can pass this function to the parent component)
    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchInput); // Call the onSearch function passed as a prop
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center border bg-white rounded-md h-[34px] relative mb-3 border-[#9F9F9F] sm:border-[#e7e7e7]">
            <div className="ml-2">
                <SearchIcon w="24" />
            </div>
            <input
                type="text"
                value={searchInput}
                className="font-light pl-3 w-full h-full bg-transparent border-none outline-none px-2 placeholder:text-[14px]"
                placeholder="Search albums, rife..."
                onChange={handleChange}
                onKeyDown={handleSearch}
            />
            <button
                type="submit"
                className="bg-[#409F83] text-white px-4 h-full rounded-md ml-2 hover:bg-[#367A61] focus:outline-none md:hidden"
                onClick={handleSubmit}
            >
                Search
            </button>
        </form>
    );
};

export default SearchForm;
