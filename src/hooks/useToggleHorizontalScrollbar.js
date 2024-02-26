import { useRef, useLayoutEffect } from "react";
import useIsOverflow from "hooks/useIsOverflow";

const useToggleHorizontalScrollbar = () => {
    const rootRef = useRef(document.getElementById("root"));
    const isOverflow = useIsOverflow(rootRef, false);

    useLayoutEffect(() => {
        if (!rootRef.current) return

        const clientHeight = rootRef.current.clientHeight;
        const offsetHeight = rootRef.current.offsetHeight;
        const difference = offsetHeight - clientHeight;

        document.documentElement.style.setProperty("--horizontal-scrollbar-height", difference + "px");
    }, [isOverflow]);
}

export default useToggleHorizontalScrollbar