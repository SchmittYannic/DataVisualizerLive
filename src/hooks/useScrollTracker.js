import { useEffect, useState, useRef } from "react"
import useScrollPosition from "./useScrollPosition"

const useScrollTracker = () => {
    const { scrollY, scrollX } = useScrollPosition();
    const previousScrollPosition = useRef({
        prevScrollY: undefined,
        prevScrollX: undefined,
    });
    const [userScrollingAction, setUserScrollingAction] = useState("idle");

    useEffect(() => {
        if (previousScrollPosition.current.prevScrollY < scrollY) {
            setUserScrollingAction("down");
        } else if (previousScrollPosition.current.prevScrollY > scrollY) {
            setUserScrollingAction("up");
        } else if (previousScrollPosition.current.prevScrollX < scrollX) {
            setUserScrollingAction("right");
        } else if (previousScrollPosition.current.prevScrollX > scrollX) {
            setUserScrollingAction("left");
        } else {
            setUserScrollingAction("idle");
        }

        previousScrollPosition.current = {
            prevScrollY: scrollY,
            prevScrollX: scrollX,
        };
    }, [scrollY, scrollX]);

    return userScrollingAction
}

export default useScrollTracker