import { useEffect, useRef, useState } from "react";

import { uploadwebm, datawebm, viswebm } from "../assets";
import VideoProgress from "./VideoProgress";
import { useWindowSize } from "../hooks";
import "./VideoSection.css";

const VideoSection = () => {
    const uploadwebmRef = useRef(null);
    const datawebmRef = useRef(null);
    const viswebmRef = useRef(null);
    const windowSize = useWindowSize();

    const [currentVideo, setCurrentVideo] = useState(null);

    const isProgressBarVertical = windowSize.width < 680 ? false : windowSize.width < 1140 ? false : true;
    const videoWidth = windowSize.width < 680 ? 344.2 : windowSize.width < 1140 ? 480 : 640;
    const videoHeight = windowSize.width < 680 ? 258.15 : windowSize.width < 1140 ? 360 : 480;

    const handleVideoEnded = (ref) => {
        const nextVideo = ref.current;
        setCurrentVideo(nextVideo);
    };

    useEffect(() => {
        if (!currentVideo) return;
        currentVideo.play();
    }, [currentVideo]);

    return (
        <section className="video-section">
            <div className="video-section-left">
                <div className={`video-section-left-item ${currentVideo === uploadwebmRef.current ? "active" : ""}`}>
                    <VideoProgress videoRef={uploadwebmRef} currentVideo={currentVideo} vertical={isProgressBarVertical} />
                    <h4>Upload</h4>
                    <p>Der erste Schritt besteht aus dem Hochladen einer Datei. DataVisualizer unterstützt das Dateiformat: csv.</p>
                </div>

                <div className={`video-section-left-item ${currentVideo === datawebmRef.current ? "active" : ""}`}>
                    <VideoProgress videoRef={datawebmRef} currentVideo={currentVideo} vertical={isProgressBarVertical} />
                    <h4>Datenansicht</h4>
                    <p>Hier wird ein Einblick in den Datensatz gewährt. An dieser Stelle wird sichergestellt, dass der Datensatz erfolgreich hochgeladen wurde.</p>
                </div>

                <div className={`video-section-left-item ${currentVideo === viswebmRef.current ? "active" : ""}`}>
                    <VideoProgress videoRef={viswebmRef} currentVideo={currentVideo} vertical={isProgressBarVertical} />
                    <h4>Visualisierung</h4>
                    <p>Durch eine Vielzahl an Einstellungen kann hier ein Diagramm erstellt und angepasst werden.</p>
                    <br />
                    <p>Das Diagramm kann im SVG-Format heruntergeladen oder als Alternative in die Zwischenablage in Form eines HTML Elements kopiert werden.</p>
                </div>
            </div>

            <div className="video-section-right">
                <video 
                    ref={uploadwebmRef}
                    width={videoWidth}
                    height={videoHeight}
                    onCanPlay={() => setCurrentVideo(uploadwebmRef.current)}
                    onEnded={() => handleVideoEnded(datawebmRef)}
                    style={{
                        zIndex: currentVideo === uploadwebmRef.current ? 2 : -1
                    }}
                    muted="muted"
                >
                    <source src={uploadwebm} type="video/webm" />
                    Your browser does not support the video tag.
                </video>

                <video 
                    ref={datawebmRef}
                    width={videoWidth}
                    height={videoHeight}
                    onEnded={() => handleVideoEnded(viswebmRef)}
                    style={{
                        zIndex: currentVideo === datawebmRef.current ? 2 : -1
                    }}
                    muted="muted"
                >
                    <source src={datawebm} type="video/webm" />
                    Your browser does not support the video tag.
                </video>

                <video 
                    ref={viswebmRef}
                    width={videoWidth}
                    height={videoHeight}
                    onEnded={() => handleVideoEnded(uploadwebmRef)}
                    style={{
                        zIndex: currentVideo === viswebmRef.current ? 2 : -1
                    }}
                    muted="muted"
                >
                    <source src={viswebm} type="video/webm" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </section>
    )
}

export default VideoSection