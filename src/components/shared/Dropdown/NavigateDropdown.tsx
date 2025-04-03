// DropdownButton.js
import React, { useState, useEffect, useRef, ReactNode, useContext } from 'react';
import { isLogined, getAccessToken } from '~/helpers/token';

interface DropdownProps {
    items: any;
    buttonContent: any,
    isOpen: boolean;
    onClickItem?: (item: any) => void;
    toggleModal: () => void;
}

const NavigateDropdown: React.FC<DropdownProps> = ({ items, isOpen, buttonContent, toggleModal, onClickItem }) => {
    const dropdownRef = useRef(null);
    return (
        <>
            <div ref={dropdownRef} className='relative'>
                <button
                    data-dropdown-toggle="dropdown"
                    onClick={toggleModal}
                    className={`text-white  bg-[#059f83] hover:bg-[#166e5e]  focus:outline-none font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center`}
                    type="button"
                    data-dropdown-placement="right"
                >
                    {buttonContent}
                    <svg className="w-2.5 h-2.5 ms-3 ml-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"></path></svg>
                </button>

                {isOpen && (
                    <>
                        <div
                            className={`z-20 block bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 absolute left-0`}
                        >
                            <div className="max-h-[300px] w-[200px] overflow-y-auto text-center">
                                {!isLogined() ? (
                                    <></>
                                ) : (
                                    <>
                                        <ul className="text-sm text-gray-700 dark:text-gray-200 py-1">
                                            {items &&
                                                Array.from(items).map((item: any, index: number) => {
                                                    return (
                                                        <li className="cursor-pointer" key={index}>
                                                            <a
                                                                className="cursor-pointer capitalize block px-4 py-[5px] hover:bg-gray-100 font-medium dark:hover:bg-gray-600 dark:hover:text-white hover:underline  overflow-ellipsis whitespace-nowrap truncate ..."
                                                                onClick={() => onClickItem(item)}
                                                            >
                                                                {item?.name}
                                                            </a>
                                                        </li>
                                                    );
                                                })}
                                        </ul>
                                    </>
                                )}
                            </div>
                        </div>
                        <div
                            onClick={() => toggleModal()}
                            className="w-screen h-screen bg-black bg-opacity-20 fixed top-0 left-0 z-10"
                        ></div>
                    </>
                )}
            </div>
        </>
    );
};


NavigateDropdown.defaultProps = {
    isOpen: false
}

export default NavigateDropdown;
