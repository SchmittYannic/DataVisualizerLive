import { Link } from "react-router-dom";

import { DropZone, InfoBox } from "./ui";
import { useData } from "../hooks/";

const UploadStep = () => {
    const { fileIsUploaded, setFileIsUploaded, setDemodata } = useData();

    const handleClick = (e) => {
        const { name } = e.target;
        setFileIsUploaded(true);
        setDemodata(name)
    }

    return (
        <>
            <main className="main-upload">

                <DropZone />

                <div style={{ marginTop: "10px", marginBottom: "10px"}}>
                    <InfoBox>
                        <p>Da es sich hierbei um eine Demo handelt und Sie ohne einen hochgeladenen Datensatz nicht fortfahren können, werden Ihnen zwei Datensätze zur Verfügung gestellt. Diese müssen nicht vorher heruntergeladen werden. Ein Klick genügt!</p>
                        <div style={{display: "flex", justifyContent: "flex-end", gap: "1em"}}>
                            <button
                                className="btn"
                                name="useAutoData"
                                title="Auto Datensatz als Demo verwenden"
                                onClick={handleClick}
                            >
                                Auto Datensatz
                            </button>
                            <button
                                className="btn"
                                name="useWetterData"
                                title="Wetter Datensatz als Demo verwenden"
                                onClick={handleClick}
                            >
                                Wetter Datensatz
                            </button>
                        </div>
                    </InfoBox>
                </div>
            </main>

            <div className="navigation-wrapper">
                <div />
                {
                    fileIsUploaded === false 
                    ?
                        <span className="btn next-btn disabled-btn">Weiter</span>
                    :
                        <Link 
                            className="btn next-btn"
                            title="Weiter zur Datenansicht"
                            to={`/DataVisualizer/DataStep`}
                        >
                            Weiter
                        </Link>
                }
            </div>
        </>
    )
}

export default UploadStep