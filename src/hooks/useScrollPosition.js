import { useEffect, useState } from "react"

const useScrollPosition = ()=> {
    const [currentScrollPosition, setCurrentScrollPosition] = useState({
        scrollY: undefined,
        scrollX: undefined,
    });

    useEffect(() => {
        const handleScroll = () => {
            setCurrentScrollPosition({
                scrollY: window.scrollY,
                scrollX: window.scrollX,
            })
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return currentScrollPosition
}

export default useScrollPosition