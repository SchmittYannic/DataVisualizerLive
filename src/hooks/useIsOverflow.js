import { useLayoutEffect, useState } from "react";


const useIsOverflow = (ref, vertical=true, callback) => {
    const [isOverflow, setIsOverflow] = useState(false);

    useLayoutEffect(() => {
        const { current } = ref;

        const trigger = () => {
            const hasOverflow = vertical ? current.scrollHeight > current.clientHeight : current.scrollWidth > current.clientWidth;
            setIsOverflow(hasOverflow);

            if (callback) callback(hasOverflow);
        };

        const observer = new ResizeObserver(trigger);

        if (current) {
            trigger();
            window.addEventListener("resize", trigger);
            observer.observe(current);
        }

        return () => {
            window.removeEventListener("resize", trigger);
            observer.disconnect();
        }
    }, [callback, ref, vertical]);

    return isOverflow;
}

export default useIsOverflow