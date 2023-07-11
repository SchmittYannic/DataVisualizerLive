import { useEffect, useRef, useState } from "react";
import { uploadwebm, datawebm, viswebm } from "../assets";
import VideoProgress2 from "./VideoProgress2";
import "./VideoSection.css";

const VideoSection = () => {
    const uploadwebmRef = useRef(null);
    const datawebmRef = useRef(null);
    const viswebmRef = useRef(null);

    const [currentVideo, setCurrentVideo] = useState(null);

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
                    <VideoProgress2 videoRef={uploadwebmRef} currentVideo={currentVideo} />
                    <h4>Upload</h4>
                    <p>Der erste Schritt besteht aus dem Hochladen einer Datei. DataVisualizer unterstützt das Datenformat: csv.</p>
                </div>

                <div className={`video-section-left-item ${currentVideo === datawebmRef.current ? "active" : ""}`}>
                    <VideoProgress2 videoRef={datawebmRef} currentVideo={currentVideo} />
                    <h4>Datenansicht</h4>
                    <p>Hier wird ein Einblick in den Datensatz gewährt. An dieser Stelle wird sichergestellt, dass der Datensatz erfolgreich hochgeladen wurde.</p>
                </div>

                <div className={`video-section-left-item ${currentVideo === viswebmRef.current ? "active" : ""}`}>
                    <VideoProgress2 videoRef={viswebmRef} currentVideo={currentVideo} />
                    <h4>Visualisierung</h4>
                    <p>Durch eine Vielzahl an Einstellungen kann hier ein Diagramm erstellt und angepasst werden.</p>
                    <br />
                    <p>Das Diagramm kann im SVG-Format heruntergeladen oder als Alternative in die Zwischenablage in Form eines HTML Elements kopiert werden.</p>
                </div>
            </div>

            <div className="video-section-right">
                <video 
                    ref={uploadwebmRef}
                    width="640"
                    height="480"
                    onCanPlay={() => setCurrentVideo(uploadwebmRef.current)}
                    onEnded={() => handleVideoEnded(datawebmRef)}
                    style={{
                        zIndex: currentVideo === uploadwebmRef.current ? 2 : -1
                    }}
                >
                    <source src={uploadwebm} type="video/webm" />
                    Your browser does not support the video tag.
                </video>

                <video 
                    ref={datawebmRef}
                    width="640"
                    height="480"
                    onEnded={() => handleVideoEnded(viswebmRef)}
                    style={{
                        zIndex: currentVideo === datawebmRef.current ? 2 : -1
                    }}
                >
                    <source src={datawebm} type="video/webm" />
                    Your browser does not support the video tag.
                </video>

                <video 
                    ref={viswebmRef}
                    width="640"
                    height="480"
                    onEnded={() => handleVideoEnded(uploadwebmRef)}
                    style={{
                        zIndex: currentVideo === viswebmRef.current ? 2 : -1
                    }}
                >
                    <source src={viswebm} type="video/webm" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </section>
    )
}

export default VideoSection