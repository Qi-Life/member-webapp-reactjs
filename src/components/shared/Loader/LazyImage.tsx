import { useState } from "react";
import { motion } from "framer-motion";
import { IoImage } from "react-icons/io5";

export default function LazyImage(props: any) {
    const [imageLoading, setImageLoading] = useState(true);
    const [pulsing, setPulsing] = useState(true);
    const [imageSrc, setImageSrc] = useState(props.src);
    const [imageError, setImageError] = useState(false);

    const imageLoaded = () => {
        setImageLoading(false);
        setTimeout(() => setPulsing(false), 600);
    };

    const handleError = () => {
        setImageSrc(""); // Clear the image source
        setImageLoading(false);
        setImageError(true);
    };

    return (
        <div className="relative">
            {imageLoading && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <IoImage className={`w-full h-full ${pulsing ? "animate-pulse" : ""}`} />
                </div>
            )}
            {imageError ? (
                // Render fallback icon when an error occurs
                <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <IoImage className="w-full h-full text-gray-400" />
                </div>
            ) : (<motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ opacity: { delay: 0.5, duration: 0.4 } }}
                onLoad={imageLoaded}
                onError={handleError}
                src={props.src}
                alt={props.alt}
                className={`${props.className} object-cover transition-transform duration-300 hover:scale-105`} // Add hover effect here
                loading="lazy"
                style={{ aspectRatio: "1 / 1" }}
            />)
            }

        </div>
    );
}
