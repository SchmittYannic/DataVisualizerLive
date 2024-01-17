import React from "react"
import { FaArrowRight } from "react-icons/fa";
import "./ExpandableSideMenu.css"

const ExpandableSideMenu = ({isOpen, setIsOpen, children}) => {

    const handleExpandClicked = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <div className={`expandable-side-menu ${isOpen ? "expanded" : ""}`}>
            <button
                className="expandable-side-menu-trigger"
                type="button"
                onClick={handleExpandClicked}
            >
                <FaArrowRight />
            </button>
            {children}
        </div>
    )
}

export default ExpandableSideMenu