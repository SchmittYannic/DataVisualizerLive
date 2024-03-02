import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import useWindowSize from "hooks/useWindowSize";
import VideoProgress from "components/VideoProgress";
import {
    isection_upload_480x920,
    isection_data_480x920,
    isection_vis_480x920,
    isection_upload_344x936,
    isection_data_344x936,
    isection_vis_344x936,
} from "assets";
import "components/VideoSectionMobile.css";

const VideoSectionMobile = () => {

    const windowSize = useWindowSize();
    const [activeTab, setActiveTab] = useState("upload");
    const timeout = useRef(null);

    const isMobile = windowSize.width <= 680;

    const activeTabWidth = isMobile ? 215 : 350;
    const inactiveTabWidth = 50;

    const isUploadActive = activeTab === "upload";
    const isDataActive = activeTab === "data";
    const isVisualisierungActive = activeTab === "visualisierung";

    const progressDuration = 40;

    const uploadImg = isMobile ? isection_upload_344x936 : isection_upload_480x920;
    const dataImg = isMobile ? isection_data_344x936 : isection_data_480x920;
    const visImg = isMobile ? isection_vis_344x936 : isection_vis_480x920;

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
        <>

            <h2>Prozess der Diagrammerstellung</h2>

            <div className="tabs">
                <motion.button
                    className={`tab${isUploadActive ? " active" : ""}`}
                    type="button"
                    onClick={() => setActiveTab("upload")}
                    title={`${isUploadActive ? "" : "auf Upload Registerkarte umschalten"}`}
                    animate={{ 
                        width: isUploadActive ? activeTabWidth : inactiveTabWidth,
                    }}
                    transition={{
                        ease: "easeInOut",
                    }}
                >                                 
                    {isUploadActive ? (
                        <>
                            <span className="font-bold">Upload</span>

                            <VideoProgress
                                fixDuration={progressDuration}
                                vertical={false}
                            />
                        </>
                    ) : (
                        <span className="font-bold">1</span> 
                    )}
                </motion.button>
                <motion.button
                    className={`tab${isDataActive ? " active" : ""}`}
                    type="button"
                    onClick={() => setActiveTab("data")}
                    title={`${isDataActive ? "" : "auf Datenansicht Registerkarte umschalten"}`}
                    animate={{ 
                        width: isDataActive ? activeTabWidth : inactiveTabWidth,
                    }}
                    transition={{
                        ease: "easeInOut",
                    }}
                >
                    {isDataActive ? (
                        <>
                            <span className="font-bold">Datenansicht</span>

                            <VideoProgress
                                fixDuration={progressDuration}
                                vertical={false}
                            />
                        </>
                    ) : (
                        <span className="font-bold">2</span> 
                    )}
                </motion.button>
                <motion.button
                    className={`tab${isVisualisierungActive ? " active" : ""}`}
                    type="button"
                    onClick={() => setActiveTab("visualisierung")}
                    title={`${isVisualisierungActive ? "" : "auf Visualisierung Registerkarte umschalten"}`}
                    animate={{ 
                        width: isVisualisierungActive ? activeTabWidth : inactiveTabWidth,
                    }}
                    transition={{
                        ease: "easeInOut",
                    }}
                >                 
                    {isVisualisierungActive ? (
                        <>
                            <span className="font-bold">Visualisierung</span>

                            <VideoProgress
                                fixDuration={progressDuration}
                                vertical={false}
                            />
                        </>
                    ) : (
                        <span className="font-bold">3</span> 
                    )}
                </motion.button>
            </div>

            <div className="video-section-content">
                {isUploadActive && (
                    <>
                        <div className="video-section-text">
                            <p>
                                Der erste Schritt besteht aus dem Hochladen eines Datensatzes. DataVisualizer unterstützt das Dateiformat: <span className="font-bold">csv</span>.
                            </p>
                            <p>
                                Das Tool lässt sich auch ohne eigenen Datensatz testen. Hierfür werden Ihnen von uns zwei Datensätze zur Verfügung gestellt.
                            </p>
                        </div>
                        <div className="image-section-image-wrapper">
                            <img src={uploadImg} alt="Ansicht des Schritts: Upload" />
                        </div>
                    </>
                )}

                {isDataActive && (
                    <>
                        <div className="video-section-text">
                            <p>
                                Hier wird ein Einblick in den Datensatz gewährt. An dieser Stelle wird sichergestellt, dass der Datensatz erfolgreich hochgeladen wurde.
                            </p>
                            <p>
                                Sortier- und Filterfunktionalität ermöglichen eine vereinfachte Navigation ihres Datensatzes. Zudem können hier einzelne Dateneinträge ein letztes Mal vor der Diagrammerstellung angepasst werden.
                            </p>
                        </div>
                        <div className="image-section-image-wrapper">
                            <img src={dataImg} alt="Ansicht des Schritts: Datenansicht" />
                        </div>
                    </>
                )}

                {isVisualisierungActive && (
                    <>
                        <div className="video-section-text">
                            <p>
                                Durch eine Vielzahl an Einstellungen kann hier ein Diagramm erstellt und angepasst werden.
                            </p>
                            <p>
                                Das Diagramm kann im <span className="font-bold">SVG</span>-Format heruntergeladen werden, wobei es hierbei seine Interaktivität verliert.
                            </p>
                            <p>
                                Alternativ kann das Diagramm zusammen mit einem Script in die Zwischenablage kopiert werden. Dies ermöglicht ein einfaches Einfügen des Diagramms in ihre Webseite. Das beigefügte Script erhält die Interaktivität des Diagramms.
                            </p>
                        </div>
                        <div className="image-section-image-wrapper">
                            <img src={visImg} alt="Ansicht des Schritts: Visualisierung" />
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default VideoSectionMobile