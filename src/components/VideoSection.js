import { useState, useRef, useEffect } from "react";

import {
    vsection_upload_1024x768,
    vsection_data_1024x768,
    vsection_vis_1024x768,
} from "assets";
import VideoProgress from "./VideoProgress";
import "./VideoSection.css";

const VideoSection = () => {

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
        <section className="video-section">

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
                            <p>Durch eine Vielzahl an Einstellungen kann hier ein Diagramm erstellt und angepasst werden.</p>
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