import { useEffect } from "react";
import { useAnimate } from "framer-motion";

const TimeProgress = ({ duration, vertical=false }) => {

    const [scope, animate] = useAnimate();

    useEffect(() => {
        if (!scope.current) return

        const keyframes = vertical ? { height: ["100%", "0%"] } : { width: ["100%", "0%"] };

        animate(
            scope.current,
            keyframes,
            { duration: duration, ease: "linear" }
        );
    }, [scope, vertical, animate, duration]);

    return (
        <>
            {duration && (
                <div 
                    className="progressbar"
                >    
                    <div
                        ref={scope}
                        className="progressbar-done"
                    >
                    </div>
                </div>
            )}
        </>
    )
}

export default TimeProgress