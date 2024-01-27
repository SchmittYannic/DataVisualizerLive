import React, { useState, useRef, useEffect } from "react"

import { uploadwebm, datawebm, viswebm } from "../assets";
import VideoProgress from "./VideoProgress";
import "./VideoSection.css"

const VideoSection = () => {

    const uploadwebmRef = useRef(null);
    const datawebmRef = useRef(null);
    const viswebmRef = useRef(null);

    const [currentVideo, setCurrentVideo] = useState(null);

    const handleVideoEnded = (ref) => {
        const nextVideo = ref.current;
        setCurrentVideo(nextVideo);
    };

    const handleTabClicked = (tab) => { 
        if (tab === "upload") {
            datawebmRef.current.pause();
            datawebmRef.current.currentTime = 0;
            datawebmRef.current.load();
            viswebmRef.current.pause();
            viswebmRef.current.currentTime = 0;
            viswebmRef.current.load();
            handleVideoEnded(uploadwebmRef); 
        }

        if (tab === "data") {
            uploadwebmRef.current.pause();
            uploadwebmRef.current.currentTime = 0;
            uploadwebmRef.current.load();
            viswebmRef.current.pause();
            viswebmRef.current.currentTime = 0;
            viswebmRef.current.load();
            handleVideoEnded(datawebmRef); 
        }

        if (tab === "visualization") {
            datawebmRef.current.pause();
            datawebmRef.current.currentTime = 0;
            datawebmRef.current.load();
            uploadwebmRef.current.pause();
            uploadwebmRef.current.currentTime = 0;
            uploadwebmRef.current.load();
            handleVideoEnded(viswebmRef); 
        }
    }

    useEffect(() => {
        if (!currentVideo) return;
        currentVideo.play();
    }, [currentVideo]);

    useEffect(() => {
        setCurrentVideo(uploadwebmRef.current);
    }, []);

    return (
        <section className="video-section">
            <div className="tabs">
                <button
                    className={`tab${currentVideo === uploadwebmRef.current ? " active" : ""}`}
                    type="button"
                    onClick={() => handleTabClicked("upload")}
                >
                    <b>Upload</b>                   
                    
                    <VideoProgress 
                        videoRef={uploadwebmRef} 
                        currentVideo={currentVideo} 
                        vertical={false} 
                    />                             
                </button>
                <button
                    className={`tab${currentVideo === datawebmRef.current ? " active" : ""}`}
                    type="button"
                    onClick={() => handleTabClicked("data")}
                >
                    <b>Datenansicht</b> 

                    <VideoProgress 
                        videoRef={datawebmRef} 
                        currentVideo={currentVideo} 
                        vertical={false} 
                    />               
                </button>
                <button
                    className={`tab${currentVideo === viswebmRef.current ? " active" : ""}`}
                    type="button"
                    onClick={() => handleTabClicked("visualization")}
                >
                    <b>Visualisierung</b> 
                    <VideoProgress 
                        videoRef={viswebmRef} 
                        currentVideo={currentVideo} 
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
                        width={1024}
                        height={768}
                        muted="muted"
                        // onCanPlay={() => setCurrentVideo(uploadwebmRef.current)}
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
                        width={1024}
                        height={768}
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
                        width={1024}
                        height={768}
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