import React, { useEffect, useState } from 'react';

interface SwitcherInterface {
  item?: string;
  width?: string;
  onText?: string;
  offText?: string;
  offColor?: string;
  isChecked?: boolean;
  isLocked?: boolean;
  cb?: (isChecked: boolean, item: string, isLocked: boolean) => void;
}

const Switcher = (props: SwitcherInterface) => {
  const [isChecked, setIsChecked] = useState(props.isChecked);

  const handleToggle = () => {
    setIsChecked(!isChecked);
    props.cb?.(!isChecked, props.item || '', props.isLocked || false);
  };

  useEffect(() => {
    setIsChecked(props.isChecked);
  }, [props.isChecked]);

  return (
    <label className={`flex items-center relative cursor-pointer select-none switcher w-[${props.width}]`}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleToggle}
        className={`appearance-none transition-colors cursor-pointer w-full h-[25px] rounded-full checked:bg-[#409F83] ${props.offColor}`}
      />
      {!isChecked ? (
        <span
          className="absolute top-[1.5px] font-medium uppercase right-3 text-white font-semibold text-sm"
          style={{
            whiteSpace: 'nowrap',
          }}
        >
          {props.offText}
        </span>
      ) : (
        <span
          className="absolute top-[1.5px] font-medium uppercase left-5 text-white font-semibold text-sm"
          style={{
            whiteSpace: 'nowrap',
          }}
        >
          {props.onText}
        </span>
      )}
      <span
        className={`w-[20px] h-[20px] absolute top-1/2 -translate-y-1/2 rounded-full transform transition-transform bg-white ${
          !isChecked ? 'left-1' : 'right-8'
        }`}
      />
    </label>
  );
};

// Default props
Switcher.defaultProps = {
  width: '80px',
  onText: 'ON',
  offText: 'OFF',
  offColor: 'bg-[#D9D9D9]',
  isChecked: false,
  isLocked: false,
};

export default Switcher;
