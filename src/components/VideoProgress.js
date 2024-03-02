import { useAnimate } from "framer-motion";
import { useEffect, useState } from "react";

import useIsDocumentHidden from "hooks/useIsDocumentHidden";

const VideoProgress = ({ videoRef, vertical=true }) => {

    const [scope, animate] = useAnimate();
    const isDocumentHidden = useIsDocumentHidden();
    const [duration, setDuration] = useState(0);
    const [animation, setAnimation] = useState(undefined);

    useEffect(() => {
        if (!videoRef.current) return

        const video = videoRef.current;

        const videoLoading = new Promise(resolve => {
            const handleEvent = () => {
                video.removeEventListener("loadedmetadata", handleEvent);
                resolve();
            }

            video.addEventListener("loadedmetadata", handleEvent);
        })

        videoLoading.then(() => {
            setDuration(video.duration);
        });
    }, [videoRef]);

    useEffect(() => {
        if (!scope.current) return

        const keyframes = vertical ? { height: ["100%", "0%"] } : { width: ["100%", "0%"] };

        const animation = animate(
            scope.current,
            keyframes,
            { duration: duration, ease: "linear" }
        );

        setAnimation(animation);
    }, [duration, animate, scope, vertical]);

    useEffect(() => {
        if (!animation) return
        if (!isDocumentHidden) {
            animation.play();
        } else {
            animation.pause();
        }
    }, [isDocumentHidden, animation]);

    return (
        <>
            {(duration > 0) && (
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

export default VideoProgress