import { Suspense, useEffect, useRef, lazy } from "react";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import Lottie from "lottie-react";

import { chartLottie, lightningLottie, settingLottie } from "assets";
import HeroChartAnimation from "components/HeroChartAnimation";
import ClipLoader from "components/ui/ClipLoader"
import useWindowSize from "hooks/useWindowSize";
import "./Homepage.css";

const VideoSection = lazy(() => import("components/VideoSection" /* webpackChunkName: "VideoSection" */));
const VideoSectionMobile = lazy(() => import("components/VideoSectionMobile" /* webpackChunkName: "VideoSectionMobile" */));
const BottomSection = lazy(() => import("components/BottomSection" /* webpackChunkName: "BottomSection" */));

const Fallback = () => (
    <div className="homepage-section-fallback">
        <div className="cliploader-centered">
            <ClipLoader loading={true} color="rgb(209,213,219)" size={50} />
        </div>
    </div>
)

const Homepage = () => {

    const { ref: videoSectionRef, inView: isVideoSectionInView } = useInView({
        triggerOnce: true,
        fallbackInView: true,
    });

    const { ref: bottomSectionRef, inView: isBottomSectionInView } = useInView({
        triggerOnce: true,
        fallbackInView: true,
    });

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
     
                    {windowSize.width > 1140 && <HeroChartAnimation />}                 
                </div>
                <div className="hero-content-border" />
                <div className="canvas-container">
                    <canvas ref={canvasRef} id="canv" width={32} height={32} aria-hidden="true"></canvas>
                </div>
            </header>

            <section className="card-section">
                <div className="card">
                    <Lottie className="card-icon" aria-hidden="true" animationData={lightningLottie} />
                    <h2 className="card-header">Schnell</h2>
                    <p>Nur 3 Schritte bis zum fertigen Diagramm.<br/>Der Prozess der Diagrammerstellung besteht aus: dem <span className="font-bold">Upload</span> des Datensatzes, der <span className="font-bold">Ansicht</span> der hochgeladenen Daten und der Erstellung der <span className="font-bold">Visualisierung</span>.</p>
                </div>
                <div className="card">
                    <Lottie className="card-icon" aria-hidden="true" animationData={chartLottie} />
                    <h2 className="card-header">Auswahl</h2>
                    <p>Eine große Auswahl an Diagrammtypen.<br/>Unterstützt die Erstellung von <span className="font-bold">Boxplots</span>, <span className="font-bold">Säulen-</span>, <span className="font-bold">Kreis-</span>, <span className="font-bold">Streu-</span>, <span className="font-bold">Linien-</span> und <span className="font-bold">Flächendiagrammen</span>.</p>
                </div>
                <div className="card">
                    <Lottie className="card-icon" aria-hidden="true" animationData={settingLottie} />
                    <h2 className="card-header">Anpassbarkeit</h2>
                    <p>Einfache Anpassung der Diagramme an individuelle Bedürfnisse.<br/>Anpassung der <span className="font-bold">Dimensionen</span>, <span className="font-bold">Farbgestaltung</span> und <span className="font-bold">Textinhalte</span> des Diagramms.</p>
                </div>
            </section>

            {
                windowSize.width > 1140 ? (
                    <section className="video-section" ref={videoSectionRef}>
                        {isVideoSectionInView && (
                            <Suspense fallback={<Fallback />}>
                                <VideoSection />
                            </Suspense>
                        )}
                    </section>
                ) : (
                    <section className="video-section-mobile" ref={videoSectionRef}>
                        {isVideoSectionInView && (
                            <Suspense fallback={<Fallback />}>
                                <VideoSectionMobile />
                            </Suspense>
                        )}
                    </section>
                )
            }

            <section className="bottom-section" ref={bottomSectionRef}>
                {isBottomSectionInView && (
                    <Suspense fallback={<Fallback />}>
                        <BottomSection />
                    </Suspense>
                )}
            </section>
        </main>
    )
}

export default Homepage