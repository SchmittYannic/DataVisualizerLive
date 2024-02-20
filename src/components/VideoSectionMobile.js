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
                        width: isUploadActive ? 350 : 50,
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
                        width: isDataActive ? 350 : 50,
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
                        width: isVisualisierungActive ? 350 : 50,
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

            <div className="video-section-content">
                {isUploadActive && (
                    <>
                        <div className="video-section-text">
                            <h4>Upload</h4>
                            <p>
                                Der erste Schritt besteht aus dem Hochladen einer Datei. DataVisualizer unterstützt das Dateiformat: csv.
                            </p>
                        </div>
                        {/* <div className="video-section-video-wrapper">
                            <video
                                id="uploadvideo"
                                ref={videoRef}
                                width={videoWidth}
                                height={videoHeight}
                                muted="muted"
                                onEnded={() => setActiveTab("data")}
                            >
                                <source src={uploadwebm} type="video/webm" />
                                Your browser does not support the video tag.
                            </video>
                        </div> */}
                    </>
                )}

                {isDataActive && (
                    <>
                        <div className="video-section-text">
                            <h4>Datenansicht</h4>
                            <p>
                                Hier wird ein Einblick in den Datensatz gewährt. An dieser Stelle wird sichergestellt, dass der Datensatz erfolgreich hochgeladen wurde.
                            </p>
                        </div>
                        {/* <div className="video-section-video-wrapper">
                            <video 
                                id="datavideo"
                                ref={videoRef}
                                width={videoWidth}
                                height={videoHeight}
                                muted="muted"
                                onEnded={() => setActiveTab("visualisierung")}
                            >
                                <source src={datawebm} type="video/webm" />
                                Your browser does not support the video tag.
                            </video>
                        </div> */}
                    </>
                )}

                {isVisualisierungActive && (
                    <>
                        <div className="video-section-text">
                            <h4>Visualisierung</h4>
                            <p>Durch eine Vielzahl an Einstellungen kann hier ein Diagramm erstellt und angepasst werden.</p>
                            <br />
                            <p>Das Diagramm kann im SVG-Format heruntergeladen oder als Alternative in die Zwischenablage in Form eines HTML Elements kopiert werden.</p>
                        </div>
                        {/* <div className="video-section-video-wrapper">
                            <video 
                                id="visvideo"
                                ref={videoRef}
                                width={videoWidth}
                                height={videoHeight}
                                muted="muted"
                                onEnded={() => setActiveTab("upload")}
                            >
                                <source src={viswebm} type="video/webm" />
                                Your browser does not support the video tag.
                            </video>
                        </div> */}
                    </>
                )}
            </div>
        </section>
    )
}

export default VideoSectionMobile