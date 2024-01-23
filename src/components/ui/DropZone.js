import { useState } from "react";
import { readCSV } from "danfojs";

import { useData } from "../../hooks";
import AsyncButton from "./AsyncButton";
import "./DropZone.css";

const DropZone = () => {
    const { setDataframe, setIsLoading, isLoading } = useData();
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileInput = (file) => {
        if(file.type === "text/csv") {
            setSelectedFile(file);
        } else {
            alert("Datei nicht vom Typ text/csv");
            setSelectedFile(null);
        }
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
    const handleDrop = (e) => {
        e.preventDefault();

        if (e.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            [...e.dataTransfer.items].forEach((item, i) => {
            // If dropped items aren't files, reject them
            if (item.kind === "file") {
                const file = item.getAsFile();
                handleFileInput(file);
            }
            });
        } else {
            // Use DataTransfer interface to access the file(s)
            [...e.dataTransfer.files].forEach((file, i) => {
                handleFileInput(file);
            });
        }
    }

    const handleDragOver = (e) => {
        //console.log("File(s) in drop zone");

        // Prevent default behavior (Prevent file from being opened)
        e.preventDefault();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            alert("Keine Datei ausgewählt");
            return
        }

        setIsLoading(true);

        const df = await readCSV(selectedFile);

        if (df.index.length > 5000 || df.columns.length > 20) {
            setIsLoading(false);
            setSelectedFile(null);
            alert("Datensatz zu groß! Da es sich um ein reines Frontend Projekt handelt, darf der Datensatz maximal 5.000 Zeilen und 20 Spalten enthalten. Dies soll ein Absturz des Browsers verhindern.")
            return
        }
        
        setDataframe(df);
    }

    return (
        <div 
            className="dropzone-container" 
            onDrop={(e) => handleDrop(e)} onDragOver={(e) => handleDragOver(e)}
        >
            <p className="upload-text">Laden Sie hier Ihren Datensatz hoch.</p>
            
            <iframe name="dummyframe" id="dummyframe" title="dummyframe" style={{display: "none"}}></iframe>
            <form target="dummyframe" method="POST" encType="multipart/form-data" >
                <label className="dropzone-label" title="Datei für Upload auswählen">
                    <div className="dropzone-content-container">
                        <svg className="dropzone-svg" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <p className="dropzone-headtext">
                            <span style={{ fontWeight: 600}}>
                                Klicken zum Hochladen
                            </span> oder durch Drag & Drop
                        </p>
                        <p className="dropzone-subtext">nur .csv Dateien</p>
                    </div>
                    <input
                        className="dropzone-input"
                        type="file" 
                        name="file" 
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        onChange={(e) => handleFileInput(e.target.files[0])}
                    />
                    <p className="filename-display">{selectedFile && "Filename: " + selectedFile.name}</p>
                    <label>
                        <AsyncButton
                            className={`btn${isLoading ? " disabled-btn" : ""}`}
                            type="submit"
                            title="ausgewählte Datei hochladen"
                            onClick={handleSubmit}
                            isLoading={isLoading}
                        >
                            Upload
                        </AsyncButton>
                    </label>
                </label>
            </form>
        </div>
    )
}

export default DropZone