import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import "./BottomSection.css";

const BottomSection = () => {

    const { ref: containerRef, inView } = useInView({
        triggerOnce: true,
        fallbackInView: true,
    });

    return (
        <section className="bottom-section" ref={containerRef}>
            {inView && (
                <div className="bottom-section-content">
                    <div className="bottom-section-text">
                        <h2 className="headtext">
                            Verwandeln Sie Ihre Daten in interaktive Diagramme
                        </h2>
                        <p className="subtext">
                            Mit unserem Service können Sie komplexe Daten in leicht verständliche, interaktive Diagramme umwandeln. Vereinfachen Sie Ihre Datenanalyse und treffen Sie wirkungsvolle Entscheidungen.
                        </p>
                    </div>
                    <div className="bottom-section-link">
                        <Link
                            className="btn next-btn"
                            to="/DataVisualizer/UploadStep"
                        >
                            Diagramm erstellen
                        </Link>
                    </div>
                </div>
            )}
        </section>
    )
}

export default BottomSection