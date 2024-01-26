import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";

import { chartLottie, lightningLottie, settingLottie } from "../assets/";
import HeroChartAnimation from "./HeroChartAnimation";
import VideoSection from "./VideoSection";
import BottomSection from "./BottomSection";
import { useWindowSize } from "../hooks";
import "./Homepage.css";

const Homepage = () => {
    const canvasRef = useRef(null);
    const heroTitle = useRef(null);
    const heroTitleOverlay = useRef(null);
    const windowSize = useWindowSize();

    useEffect(() => {
        if(heroTitle.current && heroTitleOverlay.current) {
            heroTitleOverlay.current.innerText = heroTitle.current.firstChild.data;
        }
        if(canvasRef.current) {
            let c = canvasRef.current;
            let $ = c.getContext('2d');


            let col = function(x, y, r, g, b) {
                $.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                $.fillRect(x, y, 1,1);
            }
            let R = function(x, y, t) {
                return( Math.floor(192 + 64*Math.cos( (x*x-y*y)/300 + t )) );
            }

            let G = function(x, y, t) {
                return( Math.floor(192 + 64*Math.sin( (x*x*Math.cos(t/4)+y*y*Math.sin(t/3))/300 ) ) );
            }

            let B = function(x, y, t) {
                return( Math.floor(192 + 64*Math.sin( 5*Math.sin(t/9) + ((x-100)*(x-100)+(y-100)*(y-100))/1100) ));
            }

            let t = 0;

            let run = function() {
                for(let x=0;x<=35;x++) {
                    for(let y=0;y<=35;y++) {
                    col(x, y, R(x,y,t), G(x,y,t), B(x,y,t));
                    }
                }
                t = t + 0.01;
                window.requestAnimationFrame(run);
            }

            run();
        }
    }, []);

    return (
        <main className="landing-main">
            <header className="hero">
                <div className="hero-content">
                    <h1 ref={heroTitle} className="hero-title">
                        DataVisualizer
                    </h1>
                    <p ref={heroTitleOverlay} className="hero-title" data-overlay aria-hidden="true"></p>
                    <p className="hero-subtitle">
                        Veranschaulichen Sie komplexe Daten durch interaktive Diagramme mit DataVisualizer.
                        {/* Veranschaulichen Sie komplexe Daten durch interaktive Diagramme mit DataVisualizer und erhalten so wertvolle Erkenntnisse und ein umfassendes Verständnis Ihrer Daten */}
                    </p>
                    <Link 
                        className="hero-btn btn next-btn" 
                        to="/DataVisualizer/UploadStep"
                    >
                        DataVisualizer starten
                    </Link>

                    {windowSize.width >= 1140 && <HeroChartAnimation />}
                </div>
                <div className="canvas-container">
                    <canvas ref={canvasRef} id="canv" width={32} height={32}></canvas>
                </div>
            </header>

            <section className="card-section">
                <div className="card">
                    <Lottie style={{ width: "48px", height: "48px" }} animationData={lightningLottie} />
                    <h4 className="card-header">Schnell</h4>
                    <p>Nur 3 Schritte bis zum fertigen Diagramm.<br/>Der Prozess der Diagrammerstellung besteht aus: dem <b>Upload</b> des Datensatzes, der <b>Ansicht</b> der hochgeladenen Daten und der Erstellung der <b>Visualisierung</b>.</p>
                </div>
                <div className="card">
                    <Lottie style={{ width: "48px", height: "48px" }} animationData={chartLottie} />
                    <h4 className="card-header">Auswahl</h4>
                    <p>Eine große Auswahl an Diagrammtypen.<br/>Unterstützt die Erstellung von <b>Boxplots</b>, <b>Säulen-</b>, <b>Kreis-</b>, <b>Streu-</b>, <b>Linien-</b> und <b>Flächendiagrammen</b>.</p>
                </div>
                <div className="card">
                    <Lottie style={{ width: "48px", height: "48px" }} animationData={settingLottie} />
                    <h4 className="card-header">Anpassbarkeit</h4>
                    <p>Einfache Anpassung der Diagramme an individuelle Bedürfnisse.<br/>Anpassung der <b>Dimensionen</b>, <b>Farbgestaltung</b> und <b>Textinhalte</b> des Diagramms.</p>
                </div>
            </section>

            <VideoSection />

            <BottomSection />
        </main>
    )
}

export default Homepage