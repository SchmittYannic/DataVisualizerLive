import { Link } from "react-router-dom";
import { InfoBox } from "./ui";
import { useData } from "../hooks";
import DataTable from "./ui/DataTable";

const DataStep = () => {
    const { dataAsJSON ,dataAsJSONLength, fileIsUploaded } = useData();

    if (fileIsUploaded) {
        return (
            <>
                <main className="main-data">
                    {/* <h2 className="step-header">Data Step</h2> */}

                    {
                        dataAsJSONLength !== 0 && <DataTable data={dataAsJSON} />
                    }
                </main>

                <div className="navigation-wrapper">
                    <Link
                        className="btn"
                        title="Zurück zum Upload"
                        to={`/DataVisualizer/UploadStep`}
                    >
                        Zurück
                    </Link>
                    <Link
                        className="btn next-btn"
                        title="Weiter zur Visualisierung"
                        to={`/DataVisualizer/VisualizationStep`}
                    >
                        Weiter
                    </Link>
                </div>
            </>
        )
    } else {
        return (
            <InfoBox>
                <p>Laden Sie bitte zuerst einen Datensatz hoch, ansonsten können Sie nicht fortfahren.</p>
                <p>Falls Sie keinen geeigneten Datensatz zur Verfügung haben, können Sie das Tool durch die Demodatensätze auf der Uploadseite ausprobieren.</p>
                <div style={{display: "flex", justifyContent: "flex-end", gap: "1em"}}>
                    <Link
                        className="btn next-btn"
                        title="Link zur Uploadseite"
                        to={`/DataVisualizer/UploadStep`}
                    >
                        zum Upload
                    </Link>
                </div>
            </InfoBox>
        )
    }
};

export default DataStep;