import { useState, useRef, useEffect } from "react";

import { useWindowSize } from "hooks";
import {
    vsection_upload_1024x768,
    vsection_data_1024x768,
    vsection_vis_1024x768,
    vsection_upload_960x720,
    vsection_upload_800x600,
    vsection_upload_640x480,
    vsection_data_960x720,
    vsection_data_800x600,
    vsection_data_640x480,
    vsection_vis_960x720,
    vsection_vis_800x600,
    vsection_vis_640x480,
} from "assets";
import VideoProgress from "./VideoProgress";
import "./VideoSection.css";

const VideoSection = () => {

    const windowSize = useWindowSize();
    const videoRef = useRef(null);

    const [activeTab, setActiveTab] = useState("upload");

    const videoWidth = windowSize.width < 680 ? 344.2
                    : windowSize.width < 850 ? 640
                    : windowSize.width < 1050 ? 800 
                    : windowSize.width < 1140 ? 960 
                    : 1024;

    const videoHeight = windowSize.width < 680 ? 258.15 
                    : windowSize.width < 850 ? 480
                    : windowSize.width < 1050 ? 600
                    : windowSize.width < 1140 ? 720 
                    : 768;

    const uploadwebm = windowSize.width < 850 ? vsection_upload_640x480
                    : windowSize.width < 1050 ? vsection_upload_800x600
                    : windowSize.width < 1140 ? vsection_upload_960x720 
                    : vsection_upload_1024x768;

    const datawebm = windowSize.width < 850 ? vsection_data_640x480
                    : windowSize.width < 1050 ? vsection_data_800x600
                    : windowSize.width < 1140 ? vsection_data_960x720 
                    : vsection_data_1024x768;

    const viswebm = windowSize.width < 850 ? vsection_vis_640x480
                    : windowSize.width < 1050 ? vsection_vis_800x600
                    : windowSize.width < 1140 ? vsection_vis_960x720 
                    : vsection_vis_1024x768;

    useEffect(() => {
        if (!videoRef.current) return
        videoRef.current.play();
    }, [activeTab]);

    return (
        <section className="video-section">

            <h2>Prozess der Diagrammerstellung</h2>

            <div className="tabs">
                <button
                    className={`tab${activeTab === "upload" ? " active" : ""}`}
                    type="button"
                    onClick={() => setActiveTab("upload")}
                    title={`${activeTab === "upload" ? "" : "auf Upload Registerkarte umschalten"}`}
                >
                    <b>Upload</b>                   
                    
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
                    <b>Datenansicht</b> 

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
                    <b>Visualisierung</b> 
                    
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
                            <h4>Upload</h4>
                            <p>
                                Der erste Schritt besteht aus dem Hochladen einer Datei. DataVisualizer unterstützt das Dateiformat: csv.
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
                            <h4>Datenansicht</h4>
                            <p>
                                Hier wird ein Einblick in den Datensatz gewährt. An dieser Stelle wird sichergestellt, dass der Datensatz erfolgreich hochgeladen wurde.
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
                            <h4>Visualisierung</h4>
                            <p>Durch eine Vielzahl an Einstellungen kann hier ein Diagramm erstellt und angepasst werden.</p>
                            <br />
                            <p>Das Diagramm kann im SVG-Format heruntergeladen oder als Alternative in die Zwischenablage in Form eines HTML Elements kopiert werden.</p>
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
        </section>
    )
}

export default VideoSection