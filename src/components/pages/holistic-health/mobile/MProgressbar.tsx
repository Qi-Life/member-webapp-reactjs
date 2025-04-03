import React, { useState } from 'react';

const MProgressBar = ({ questionData }: { questionData: any[] }) => {
    // Calculate the total number of questions
    const totalQuestions = questionData.reduce((acc, type) => acc + type.questions.length, 0);

    // Calculate the width percentage for each question type
    const segments = questionData.map((type) => {
        const typeQuestions = type.questions.filter((type: any) => type.isAnswer != 0).length;
        return {
            width: (typeQuestions / totalQuestions) * 100,
            color: type.style.color
        };
    });

    return (
        <div className="w-full h-[5px] bg-gray-300 flex">
            {segments.map((segment, index) => (
                <div
                    key={index}
                    className="h-full transition-all duration-500"
                    style={{
                        width: `${segment.width}%`,
                        backgroundColor: segment.color,
                    }}
                ></div>
            ))}
        </div>
    );
};

MProgressBar.defaultProps = {
    questionData: [],
};

export default MProgressBar;
