import { Link } from "react-router-dom";

import { InfoBox, AsyncLink } from "components/ui";
import { useData, useToggleHorizontalScrollbar } from "hooks";
import DataTable from "features/datavisualizer/DataTable";

const DataStep = () => {
    const { dataAsJSONLength, fileIsUploaded, isLoading } = useData();
    useToggleHorizontalScrollbar();

    if (fileIsUploaded) {
        return (
            <>
                <main className="main-data">
                    <div className="table-wrapper">
                        {
                            dataAsJSONLength !== 0 && <DataTable />
                        }
                    </div>
                </main>

                <div className="navigation-wrapper">
                    <Link
                        className="btn"
                        title="Zurück zum Upload"
                        to={`/DataVisualizer/UploadStep`}
                    >
                        Zurück
                    </Link>
                    <AsyncLink
                        className={`btn next-btn${isLoading ? " disabled-btn" : ""}`}
                        title={isLoading ? "Änderungen werden gespeichert..." : "Weiter zur Visualisierung"}
                        to={`/DataVisualizer/VisualizationStep`}
                        isLoading={isLoading}
                    >
                        Weiter
                    </AsyncLink>
                </div>
            </>
        )
    } else {
        return (
            <main className="main-data">
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
            </main>
        )
    }
};

export default DataStep;