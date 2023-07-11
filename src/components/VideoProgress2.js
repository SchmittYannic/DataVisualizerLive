import { motion } from "framer-motion";

const VideoProgress2 = ({ videoRef, currentVideo }) => {
    return (
        <div 
            className="progressbar"
        >
            {
                videoRef.current  && currentVideo === videoRef.current &&
                    <motion.div
                        className="progressbar-done"

                        initial={{ height: "0%" }}
                        animate={{ height: `100%` }}
                        transition={{ duration: videoRef.current.duration }}
                        layout
                    >
                    </motion.div>
            }
        </div>
    )
}

export default VideoProgress2