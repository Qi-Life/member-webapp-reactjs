import React, { useState } from 'react';


interface ProgressBarSegMent {
    questionData: any[], questionTypeSelectedIndex: number, questionSelectedIndex: number
}

const timeLineBalls = (n: any, current: any) => (
    Array(n).fill(0).map((i, index) => (
        <div
            key={index}
            className={`timeline-ball ${current > index ? 'active' : current == index ? 'current' : 'null'}`}
        >
            <span className='timeline-ball-text'>{index + 1}</span>
        </div>
    ))
);



const ProgressBarSegMent = ({ questionData, questionTypeSelectedIndex, questionSelectedIndex }: ProgressBarSegMent) => {
    const intermediaryBalls = questionData[questionTypeSelectedIndex]?.questions.length;
    const calculatedWidth = ((questionSelectedIndex) / (intermediaryBalls - 1)) * 100

    return (
        <div className="timeline">
            <div className="timeline-progress" style={{ width: `${calculatedWidth}%` }} />
            {timeLineBalls(intermediaryBalls, questionSelectedIndex)}
        </div>
    );
};

ProgressBarSegMent.defaultProps = {
    questionData: [],
    questionTypeSelectedIndex: 0,
    questionSelectedIndex: 0,
};

export default ProgressBarSegMent;
