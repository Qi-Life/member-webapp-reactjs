import React, { useState, useEffect } from "react";

interface ChangingProgressProviderProps {
  values: number[];
  interval?: number;
  children: (value: number) => React.ReactNode;
}

const ChangingProgressProvider: React.FC<ChangingProgressProviderProps> = ({ values, interval = 300, children }) => {
  const [valuesIndex, setValuesIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setValuesIndex((prevIndex) => {
        if(prevIndex == values.length - 1){
            clearInterval(timer)
        }else{
            const newIndex = (prevIndex + 1) % values.length;
            return newIndex;
        }
      });
    }, interval);
    // Cleanup the interval on component unmount
    return () => clearInterval(timer);
  }, [values.length, interval]);

  return <>{children(values[valuesIndex])}</>;
};

export default ChangingProgressProvider;
