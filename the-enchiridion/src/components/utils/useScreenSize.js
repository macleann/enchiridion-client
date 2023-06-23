import { useState, useEffect } from 'react';

export const useScreenSize = () => {
    const [screenSize, setScreenSize] = useState(getCurrentDimension());
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    function getCurrentDimension() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
        };
    }

    useEffect(() => {
        function updateDimension() {
            setScreenSize(getCurrentDimension());
            setIsMobile(window.innerWidth <= 768);
        }

        window.addEventListener("resize", updateDimension);
        return () => window.removeEventListener("resize", updateDimension);
    }, []);

    return { screenSize, isMobile };
};