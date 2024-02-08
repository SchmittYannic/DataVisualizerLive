import { motion } from "framer-motion";

const VideoProgress = ({ videoRef, currentVideo, vertical=true }) => {

    const initial = vertical ? { height: "100%" } : { width: "100%" };
    const animate = vertical ? { height: "0%" } : { width: "0%" };

    return (
        <div 
            className="progressbar"
        >
            {
                videoRef.current  && currentVideo === videoRef.current &&
                    <motion.div
                        className="progressbar-done"

                        initial={initial}
                        animate={animate}
                        transition={{ duration: isNaN(videoRef.current.duration) ? 13.299 : videoRef.current.duration}}
                        layout
                    >
                    </motion.div>
            }
        </div>
    )
}

export default VideoProgress