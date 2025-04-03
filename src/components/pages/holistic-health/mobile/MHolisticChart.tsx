
import React, { useState, useEffect, useRef } from 'react';
import ChangingProgressProvider from '../ChangingProgressProvider';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import AnimatedNumbers from "react-animated-numbers";


const CircleProgress = ({ percentage }: { percentage: number }) => {
  const generateValues = (percentage: number) => {
    const step = percentage > 50 ? 10 : 5;
    const generatedValues = [];
    for (let i = 0; i <= percentage; i += step) {
      generatedValues.push(i);
    }
    generatedValues.push(percentage); // Ensure the last value is the target percentage
    return generatedValues;
  };

  return (
    <div className='w-[200px] relative'>
      <ChangingProgressProvider values={generateValues(percentage)}>
        {result => (
          <CircularProgressbar
            text={``}
            value={result}
            counterClockwise={false}
            strokeWidth={10} 
            styles={buildStyles({
              strokeLinecap: 'butt',
              pathColor: `#D6C6E4`,
              textColor: '#297D82',
              trailColor: '#ebebeb',
              backgroundColor: '#ebebeb',
              pathTransitionDuration: 0.15,
            })}
          />
        )}
      </ChangingProgressProvider>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <AnimatedNumbers
          includeComma
          transitions={(index) => ({
            type: "spring",
            duration: 3,
          })}
          animateToNumber={percentage} // Dynamically show the percentage
          fontStyle={{
            fontSize: 40,
            fontWeight: 600,
            fontFamily: 'Lexend, Montserrat'
          }}
        />
      </div>
    </div>
  );
};


const VerticalProgressBar = ({ targetPercentage, color, typeName, barColor }: { targetPercentage: number, color: string, typeName: string, barColor: string }) => {

  const [currentPercentage, setCurrentPercentage] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const interval = 50;
    const step = targetPercentage / (duration / interval);

    const intervalId = setInterval(() => {
      setCurrentPercentage((prev) => {
        if (prev + step >= targetPercentage) {
          clearInterval(intervalId);
          return Math.round(targetPercentage);
        }
        return Math.round(prev + step);
      });
    }, interval);

    return () => clearInterval(intervalId);
  }, [targetPercentage]);

  const hexToRgba = (hex: string, opacity: any) => {
    // Remove the hash symbol if present
    const cleanedHex = hex.replace('#', '');

    // Parse the R, G, and B values
    const r = parseInt(cleanedHex.substring(0, 2), 16);
    const g = parseInt(cleanedHex.substring(2, 4), 16);
    const b = parseInt(cleanedHex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <div className="items-center h-full pb-5 pt-10 flex-1">
      <div className='h-full flex flex-col justify-start items-center'>
        <div className="text-sm mb-5 text-[#9A9A9A]">{currentPercentage} %</div>
        <div className='h-full w-[8px] flex flex-col justify-end items-center rounded-t-2xl mb-5'
          style={{
            backgroundColor: barColor,
            backgroundSize: 'cover',
            backgroundBlendMode: 'overlay',
          }}
        >
          <div
            className="w-[10px] transition-all duration-500 rounded-t-2xl"
            style={{
              height: `${currentPercentage}%`,
              transform: `translateY(${currentPercentage == 0 ? '0px' : currentPercentage - targetPercentage})`,
              opacity: `${currentPercentage < targetPercentage ? 0.8 : 1}`,
              backgroundColor: color,
            }}
          ></div>
        </div>
        <div className="text-sm text-center h-[220px] line-clamp-5 text-[#9A9A9A]">{typeName}</div>
      </div>
    </div>
  );
};


const MHolisticChart = ({ questionData, totalPercent }: any) => {
  console.log("🚀 ~ MHolisticChart ~ totalPercent:", totalPercent)

  return (
    <>
      <div className='justify-center h-screen'>
        <div className='flex-1 flex flex-col justify-center items-center h-full' >
          <div className='py-5'>
            <CircleProgress percentage={totalPercent} />
          </div>
          <h2 className='text-[16px] mb-5' style={{ color: '#39353D' }}>YOUR HOLISTIC HEALTH SCORE</h2>
          <div className="flex flex-1  bg-white rounded rounded-[50px] mx-5 mb-5">
            {questionData?.map((item: any, index: number) => (
              <VerticalProgressBar key={index}
                targetPercentage={item.targetPercentage}
                color={item.style.color} typeName={item.type_name} barColor={item.style.barColor} />
            ))}
          </div>
        </div>

      </div>
    </>
  )
}

export default MHolisticChart