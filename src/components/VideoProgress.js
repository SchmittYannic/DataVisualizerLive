import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const VideoProgress = ({ videoRef, active=true, vertical=true }) => {

    const [duration, setDuration] = useState(0);

    const initial = vertical ? { height: "100%" } : { width: "100%" };
    const animate = vertical ? { height: "0%" } : { width: "0%" };

    useEffect(() => {
        if (!active) {
            setDuration(0);
            return
        }
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
    }, [active, videoRef]);

    return (
        <div 
            className="progressbar"
        >
            {
                active && duration > 0 &&
                    <motion.div
                        className="progressbar-done"
                        initial={initial}
                        animate={animate}
                        transition={{ duration: duration }}
                        layout
                    >
                    </motion.div>
            }
        </div>
    )
}

export default VideoProgress