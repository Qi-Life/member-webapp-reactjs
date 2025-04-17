import React, { useContext, useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { AppContext } from '~/components/context/AppProvider';
import { updateCustomFrequencies } from '~/services/CustomFrequencyServices';

const AddCustomFrequencyModal = (props: any) => {
  const {
  } = useContext(AppContext);
  const [statusButton, setStatusButton] = useState(false);
  const [frequencyHz, setFrequency] = useState('');
  const [isValid, setIsValid] = useState(true);

  const validateNumber = (value: any, min: any, max: any) => {
    return value >= min && value <= max
  };

  const handleChangeHz = (e: any) => {
    // Assuming min and max are predefined values
    const min = 1;
    const max = 22000;
    const isValidNumber = validateNumber(e.target.value.trim(), min, max);
    setIsValid(isValidNumber);
    setFrequency(e.target.value.trim());
  };

  const handleAddNewFrequency = async () => {
    try {
      if(!isValid) return 
      const param = { id: props.frequencyDetail.id, frequencies: [...props.frequencyDetail.frequencies.split('/'), frequencyHz].join('/') };
      const res = await updateCustomFrequencies(param);
      props.handleClickClose();
      await props.handleAddFrequencySuccess(frequencyHz);
      toast.success('Add new frequency success')
      setFrequency('');
    } catch (error) {
      toast.error('Add new frequency error')
      props.handleClickClose();
    }
  };

  return (
    <div
      onClick={(e) => props.handleOverlayClick(e)}
      className={` ${props.isOpenNewFrequency ? 'w-screen min-h-screen h-full absolute top-0 bg-black bg-opacity-20 z-50' : 'hidden'
        }   `}
    >
      <div
        className={`max-w-[500px] w-full z-10  duration-200 ease-linear  ${props.isOpenNewFrequency ? 'translate-y-1/2 opacity-100 visible ' : 'top-0 opacity-0 invisible'
          } bg-white shadow-lg border border-gray rounded-md absolute top-0 left-1/2 -translate-x-1/2 fixed`}
      >
        <h1 className="text-center text-[#059f83] p-[15px] font-medium">Add new frequency</h1>
        <hr />
        <div className="p-[15px]">
          <h1 className="text-[#333333] font-bold mb-4">{statusButton ? 'Frequency Album' : 'Frequency Custom'}</h1>
          <div className="relative inline-block  w-full">
            {statusButton ? (
              <>
                {/* <Select options={mp3s} onChange={onChangeMp3s} /> */}
              </>
            ) : (
              <>
                <div className="border-2 flex items-center w-full h-[34px] rounded-md overflow-hidden">
                  <input
                    value={frequencyHz}
                    type="number"
                    min={1}
                    max={22000}
                    className=" flex-1 h-full px-[6px] placeholder:text-[#333333] placeholder:font-medium rounded-sm outline-none"
                    onChange={(e) => handleChangeHz(e)}
                  />
                  <span className="leading-[34px] bg-[#888] font-medium  text-white border p-2 overflow-hidden ">
                    Hz
                  </span>
                </div>
                {!isValid && <p style={{ color: 'red' }}>Please enter a number between 1 and 22000.</p>}

              </>
            )}
          </div>
        </div>

        <hr />
        <div className="flex items-center justify-end p-[15px]">
          <button
            onClick={() => {
              props.handleClickClose();
            }}
            className="mx-1 h-[34px] px-[12px]  rounded-sm shadow-md  font-medium text-white bg-[#6C757D]"
          >
            Close
          </button>
          <button
            onClick={() => handleAddNewFrequency()}
            className="mx-1 h-[34px] px-[12px]  rounded-sm shadow-md  bg-[#059f83] font-medium text-white"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCustomFrequencyModal;
