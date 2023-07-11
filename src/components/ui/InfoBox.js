import { info } from "../../assets";
import "./InfoBox.css";

const InfoBox = ({ children }) => {
    return (
        <div className="infobox">
            <img src={info} alt="info-symbol" />
            <div className="infobox-content">
                {children}
            </div>
        </div>
    )
}

export default InfoBox