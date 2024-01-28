import { FaArrowLeft } from "react-icons/fa";

const BackButton = ({ onClick }) => (
    <button
        className="side-menu-back-btn"
        type="button"
        onClick={onClick}
        title="Zurück zur Navigation"
    >
        <FaArrowLeft />
    </button>
);

export default BackButton