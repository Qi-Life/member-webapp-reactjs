import React, { useState, useEffect } from "react";
const AnimatedProgressProvider = ({ valueStart, valueEnd, duration, children }: any) => {
    const [value, setValue] = useState(valueStart);

    useEffect(() => {
        let startTime: any;
        const animate = (timestamp: any) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
            setValue(valueStart + progress * (valueEnd - valueStart));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [valueStart, valueEnd, duration]);

    return children(value);
};

export default AnimatedProgressProvider