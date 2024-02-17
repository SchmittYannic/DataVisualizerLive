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
    const uploadwebmRef = useRef(null);
    const datawebmRef = useRef(null);
    const viswebmRef = useRef(null);

    const [currentVideo, setCurrentVideo] = useState(null);

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

    const handleVideoEnded = (ref) => {
        const nextVideo = ref.current;
        setCurrentVideo(nextVideo);
    };

    const handleTabClicked = (tab) => { 
        if (tab === "upload") {
            handleVideoEnded(uploadwebmRef); 
        }

        if (tab === "data") {
            handleVideoEnded(datawebmRef); 
        }

        if (tab === "visualization") {
            handleVideoEnded(viswebmRef); 
        }
    }

    useEffect(() => {
        if (!currentVideo) return;

        if (currentVideo === uploadwebmRef.current) {
            datawebmRef.current.pause();
            datawebmRef.current.currentTime = 0;
            datawebmRef.current.load();
            viswebmRef.current.pause();
            viswebmRef.current.currentTime = 0;
            viswebmRef.current.load();
        }

        if (currentVideo === datawebmRef.current) {
            uploadwebmRef.current.pause();
            uploadwebmRef.current.currentTime = 0;
            uploadwebmRef.current.load();
            viswebmRef.current.pause();
            viswebmRef.current.currentTime = 0;
            viswebmRef.current.load();
        }

        if (currentVideo === viswebmRef.current) {
            uploadwebmRef.current.pause();
            uploadwebmRef.current.currentTime = 0;
            uploadwebmRef.current.load();
            datawebmRef.current.pause();
            datawebmRef.current.currentTime = 0;
            datawebmRef.current.load();
        }

        currentVideo.play();
    }, [currentVideo]);

    useEffect(() => {
        setCurrentVideo(uploadwebmRef.current);
    }, []);

    return (
        <section className="video-section">

            <h2>Prozess der Diagrammerstellung</h2>

            <div className="tabs">
                <button
                    className={`tab${currentVideo === uploadwebmRef.current ? " active" : ""}`}
                    type="button"
                    onClick={() => handleTabClicked("upload")}
                    title={`${currentVideo === uploadwebmRef.current ? "" : "auf Upload Registerkarte umschalten"}`}
                >
                    <b>Upload</b>                   
                    
                    <VideoProgress
                        videoRef={uploadwebmRef}
                        active={currentVideo === uploadwebmRef.current}
                        vertical={false}
                    />
                </button>
                <button
                    className={`tab${currentVideo === datawebmRef.current ? " active" : ""}`}
                    type="button"
                    onClick={() => handleTabClicked("data")}
                    title={`${currentVideo === datawebmRef.current ? "" : "auf Datenansicht Registerkarte umschalten"}`}
                >
                    <b>Datenansicht</b> 

                    <VideoProgress
                        videoRef={datawebmRef}
                        active={currentVideo === datawebmRef.current}
                        vertical={false}
                    />
                </button>
                <button
                    className={`tab${currentVideo === viswebmRef.current ? " active" : ""}`}
                    type="button"
                    onClick={() => handleTabClicked("visualization")}
                    title={`${currentVideo === viswebmRef.current ? "" : "auf Visualisierung Registerkarte umschalten"}`}
                >
                    <b>Visualisierung</b> 
                    
                    <VideoProgress
                        videoRef={viswebmRef}
                        active={currentVideo === viswebmRef.current}
                        vertical={false}
                    />
                </button>
            </div>

            <div className={`video-section-content${currentVideo === uploadwebmRef.current ? " display-block" : " display-none"}`}>
                <div className="video-section-text">
                    <h4>Upload</h4>
                    <p>
                        Der erste Schritt besteht aus dem Hochladen einer Datei. DataVisualizer unterstützt das Dateiformat: csv.
                    </p>
                </div>
                <div className="video-section-video-wrapper">
                    <video
                        id="uploadvideo"
                        ref={uploadwebmRef}
                        width={videoWidth}
                        height={videoHeight}
                        muted="muted"
                        onEnded={() => handleVideoEnded(datawebmRef)}
                    >
                        <source src={uploadwebm} type="video/webm" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>

            <div className={`video-section-content${currentVideo === datawebmRef.current ? " display-block" : " display-none"}`}>
                <div className="video-section-text">
                    <h4>Datenansicht</h4>
                    <p>
                        Hier wird ein Einblick in den Datensatz gewährt. An dieser Stelle wird sichergestellt, dass der Datensatz erfolgreich hochgeladen wurde.
                    </p>
                </div>
                <div className="video-section-video-wrapper">
                    <video 
                        id="datavideo"
                        ref={datawebmRef}
                        width={videoWidth}
                        height={videoHeight}
                        muted="muted"
                        onEnded={() => handleVideoEnded(viswebmRef)}
                    >
                        <source src={datawebm} type="video/webm" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>

            <div className={`video-section-content${currentVideo === viswebmRef.current ? " display-block" : " display-none"}`}>
                <div className="video-section-text">
                    <h4>Visualisierung</h4>
                    <p>Durch eine Vielzahl an Einstellungen kann hier ein Diagramm erstellt und angepasst werden.</p>
                    <br />
                    <p>Das Diagramm kann im SVG-Format heruntergeladen oder als Alternative in die Zwischenablage in Form eines HTML Elements kopiert werden.</p>
                </div>
                <div className="video-section-video-wrapper">
                    <video 
                        id="visvideo"
                        ref={viswebmRef}
                        width={videoWidth}
                        height={videoHeight}
                        muted="muted"
                        onEnded={() => handleVideoEnded(uploadwebmRef)}
                    >
                        <source src={viswebm} type="video/webm" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </section>
    )
}

export default VideoSection