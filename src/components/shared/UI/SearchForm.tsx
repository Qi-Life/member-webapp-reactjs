import React, { useState } from 'react';
import SearchIcon from 'assets/img/ic-search.png';

const SearchForm = ({ onSearch }: any) => {
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
        <form onSubmit={handleSubmit} className="flex items-center bg-[#2A4C4F]/10 py-[1.18rem] px-[1.56rem] text-xl rounded-[4.37rem]">
            <img src={SearchIcon} />
            <input
                type="text"
                value={searchInput}
                className="font-light pl-3 w-full h-full bg-transparent border-none outline-none px-2 placeholder:text-xl"
                placeholder="Search albums, rife..."
                onChange={handleChange}
                onKeyDown={handleSearch}
            />
            <button
                type="submit"
                className="bg-[#409F83] text-white px-4 h-full rounded-xl ml-2 hover:bg-[#367A61] focus:outline-none md:hidden py-2"
                onClick={handleSubmit}
            >
                Search
            </button>
        </form>
    );
};

export default SearchForm;
