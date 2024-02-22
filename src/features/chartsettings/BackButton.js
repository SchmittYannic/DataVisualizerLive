import { FaArrowLeft } from "react-icons/fa";

const BackButton = ({ onClick }) => (
    <button
        className="side-menu-back-btn"
        type="button"
        onClick={onClick}
        title="Zurück zur Navigation"
    >
        <FaArrowLeft 
            role="graphics-symbol"
            aria-label="Zurück Button" />
    </button>
);

export default BackButton