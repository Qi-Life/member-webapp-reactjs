// DropdownButton.js
import React, { useState, useEffect, useRef, ReactNode, useContext } from 'react';
import { toast } from 'react-toastify';
import { updateCustomFrequencies } from '~/services/CustomFrequencyServices';

interface DropdownProps {
  index: any;
  tracks: any;
  frequencyDetail: any;
  placement: string;
  background: string;
  buttonContent: ReactNode;
  onDeleteTrackSuccess: any;
}

const DropdownItem: React.FC<DropdownProps> = ({
  index,
  tracks,
  frequencyDetail,
  background,
  buttonContent,
  onDeleteTrackSuccess,
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleOutsideClick = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (confirm('Do you want to delete this custom frequencies ?') === true) {
        const newTrack = tracks.filter((_: any, _index: number) => _index != index);
        await updateCustomFrequencies({
          id: frequencyDetail.id,
          frequencies: newTrack.map((item: any) => item.id).join('/'),
        });
        onDeleteTrackSuccess(newTrack);
        setDropdownOpen(false);
        toast.success('Delete custom frequency success');
      }
    } catch (error) {
      toast.error('Delete error');
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <div ref={dropdownRef}>
      <button
        id={`dropdownDefaultButton${index}`}
        data-dropdown-toggle="dropdown"
        onClick={toggleDropdown}
        className={`text-white ${background} relative focus:outline-none font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center`}
        type="button"
        data-dropdown-placement="left"
      >
        {buttonContent}
      </button>
      {isDropdownOpen && (
        <div
          id={`dropdown${index}`}
          className="z-10 block bg-white divide-y divide-gray-100 rounded-lg shadow  dark:bg-gray-700 absolute right-[25px] bottom-0 overflow-hidden"
          aria-labelledby={`dropdownDefaultButton${index}`}
        >
          <div className="py-2" onClick={() => handleDelete()}>
            <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-default">
              Delete
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownItem;
