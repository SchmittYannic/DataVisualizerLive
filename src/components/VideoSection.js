import { useState, useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";

import {
    vsection_upload_1024x768,
    vsection_data_1024x768,
    vsection_vis_1024x768,
} from "assets";
import VideoProgress from "./VideoProgress";
import "./VideoSection.css";

const VideoSection = () => {

    const { ref: containerRef, inView } = useInView({
        triggerOnce: true,
        fallbackInView: true,
    });
    const videoRef = useRef(null);

    const [activeTab, setActiveTab] = useState("upload");

    const videoWidth = 1024;
    const videoHeight = 768;
    const uploadwebm = vsection_upload_1024x768;
    const datawebm = vsection_data_1024x768;
    const viswebm = vsection_vis_1024x768;

    useEffect(() => {
        if (!videoRef.current) return
        videoRef.current.play();
    }, [activeTab]);

    return (
        <section className="video-section" ref={containerRef}>

            {inView && (
                <>
                    <h2>Prozess der Diagrammerstellung</h2>

                    <div className="tabs">
                        <button
                            className={`tab${activeTab === "upload" ? " active" : ""}`}
                            type="button"
                            onClick={() => setActiveTab("upload")}
                            title={`${activeTab === "upload" ? "" : "auf Upload Registerkarte umschalten"}`}
                        >
                            <span className="font-bold">Upload</span>                   
                            
                            {activeTab === "upload" && (
                                <VideoProgress
                                    videoRef={videoRef}
                                    vertical={false}
                                />
                            )}
                        </button>
                        <button
                            className={`tab${activeTab === "data" ? " active" : ""}`}
                            type="button"
                            onClick={() => setActiveTab("data")}
                            title={`${activeTab === "data" ? "" : "auf Datenansicht Registerkarte umschalten"}`}
                        >
                            <span className="font-bold">Datenansicht</span> 

                            {activeTab === "data" && (
                                <VideoProgress
                                    videoRef={videoRef}
                                    vertical={false}
                                />
                            )}
                        </button>
                        <button
                            className={`tab${activeTab === "visualisierung" ? " active" : ""}`}
                            type="button"
                            onClick={() => setActiveTab("visualisierung")}
                            title={`${activeTab === "visualisierung" ? "" : "auf Visualisierung Registerkarte umschalten"}`}
                        >
                            <span className="font-bold">Visualisierung</span> 
                            
                            {activeTab === "visualisierung" && (
                                <VideoProgress
                                    videoRef={videoRef}
                                    vertical={false}
                                />
                            )}
                        </button>
                    </div>

                    <div className={`video-section-content`}>
                        {activeTab === "upload" && (
                            <>
                                <div className="video-section-text">
                                    <p>
                                        Der erste Schritt besteht aus dem Hochladen eines Datensatzes. DataVisualizer unterstützt das Dateiformat: <span className="font-bold">csv</span>.<br/>Das Tool lässt sich auch ohne eigenen Datensatz testen. Hierfür werden Ihnen von uns zwei Datensätze zur Verfügung gestellt.
                                    </p>
                                </div>
                                <div className="video-section-video-wrapper">
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
                                </div>
                            </>
                        )}

                        {activeTab === "data" && (
                            <>
                                <div className="video-section-text">
                                    <p>
                                        Hier wird ein Einblick in den Datensatz gewährt. An dieser Stelle wird sichergestellt, dass der Datensatz erfolgreich hochgeladen wurde.
                                    </p>
                                    <p>
                                        Sortier- und Filterfunktionalität ermöglichen eine vereinfachte Navigation ihres Datensatzes. Zudem können hier einzelne Dateneinträge ein letztes Mal vor der Diagrammerstellung angepasst werden.
                                    </p>
                                </div>
                                <div className="video-section-video-wrapper">
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
                                </div>
                            </>
                        )}

                        {activeTab === "visualisierung" && (
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
                                <div className="video-section-video-wrapper">
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
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
        </section>
    )
}

export default VideoSection