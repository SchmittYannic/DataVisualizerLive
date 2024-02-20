import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import VideoProgress from "./VideoProgress";

const VideoSectionMobile = () => {

    const [activeTab, setActiveTab] = useState("upload");
    const timeout = useRef(null);

    const isUploadActive = activeTab === "upload";
    const isDataActive = activeTab === "data";
    const isVisualisierungActive = activeTab === "visualisierung";

    const progressDuration = 20;

    useEffect(() => {
        if (timeout.current) clearTimeout(timeout.current);

        timeout.current = setTimeout(() => {
            setActiveTab((prev) => {
                if (prev === "upload") return "data"
                if (prev === "data") return "visualisierung"
                if (prev === "visualisierung") return "upload"
            })
        }, progressDuration * 1000);
    }, [activeTab]);

    return (
        <section className="video-section-mobile">

            <h2>Prozess der Diagrammerstellung</h2>

            <div className="tabs">
                <motion.button
                    className={`tab${isUploadActive ? " active" : ""}`}
                    type="button"
                    onClick={() => setActiveTab("upload")}
                    title={`${isUploadActive ? "" : "auf Upload Registerkarte umschalten"}`}
                    animate={{ 
                        width: isUploadActive ? 300 : 50,
                    }}
                    transition={{
                        ease: "easeInOut",
                    }}
                >                                 
                    {isUploadActive ? (
                        <>
                            <b>Upload</b>

                            <VideoProgress
                                fixDuration={progressDuration}
                                vertical={false}
                            />
                        </>
                    ) : (
                        <b>1</b> 
                    )}
                </motion.button>
                <motion.button
                    className={`tab${isDataActive ? " active" : ""}`}
                    type="button"
                    onClick={() => setActiveTab("data")}
                    title={`${isDataActive ? "" : "auf Datenansicht Registerkarte umschalten"}`}
                    animate={{ 
                        width: isDataActive ? 300 : 50,
                    }}
                    transition={{
                        ease: "easeInOut",
                    }}
                >
                    {isDataActive ? (
                        <>
                            <b>Datenansicht</b>

                            <VideoProgress
                                fixDuration={progressDuration}
                                vertical={false}
                            />
                        </>
                    ) : (
                        <b>2</b> 
                    )}
                </motion.button>
                <motion.button
                    className={`tab${isVisualisierungActive ? " active" : ""}`}
                    type="button"
                    onClick={() => setActiveTab("visualisierung")}
                    title={`${isVisualisierungActive ? "" : "auf Visualisierung Registerkarte umschalten"}`}
                    animate={{ 
                        width: isVisualisierungActive ? 300 : 50,
                    }}
                    transition={{
                        ease: "easeInOut",
                    }}
                >                 
                    {isVisualisierungActive ? (
                        <>
                            <b>Visualisierung</b>

                            <VideoProgress
                                fixDuration={progressDuration}
                                vertical={false}
                            />
                        </>
                    ) : (
                        <b>3</b> 
                    )}
                </motion.button>
            </div>
        </section>
    )
}

export default VideoSectionMobile