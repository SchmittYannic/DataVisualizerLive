import { useContext, useRef } from "react"
import { DataContext } from "../context/DataProvider";

// Component from: https://www.pluralsight.com/guides/how-to-use-a-simple-form-submit-with-files-in-react
const FileUploader = ({ onFileSelectSuccess, onFileSelectError }) => {
    const { setFileIsUploaded } = useContext(DataContext);
    const fileInput = useRef(null);

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        setFileIsUploaded(false)

        if(file.type === "text/csv") {
            onFileSelectSuccess(file)
        } else {
            onFileSelectError({ error: "File is not of type text/csv" })
        }
    }

    return (
        <div className="file-uploader">
            <input ref={fileInput} type="file" onChange={handleFileInput} />
            <button 
                style={{borderColor: "black", width: "50px", height: "50px"}}
                onClick={e => fileInput.current && fileInput.current.click()} 
            >
            </button>
        </div>
    )
}

export default FileUploader