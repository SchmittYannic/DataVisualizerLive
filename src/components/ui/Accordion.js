import { useEffect, useId, useRef, useState } from "react";
import DropdownIcon from "./icons/DropdownIcon";
import "./Accordion.css";

const AccordionTrigger = ({ id, isExpanded, onClick, controls, head }) => {
    return (
        <button
            id={id}
            className={`accordion-trigger ${isExpanded ? "expanded" : ""}`}
            type="button"
            onClick={onClick}
            aria-expanded={isExpanded}
            aria-controls={controls}
        >
            {head}
            <DropdownIcon classes={`accordion-trigger-svg ${isExpanded ? "open" : ""}`} />
        </button>
    )
};

const AccordionContent = ({ children, id, labelledby, contentRef}) => {
    return (
        <div 
            id={id}
            className="accordion-content-wrapper"
            ref={contentRef}
            aria-labelledby={labelledby}
        >
            <div
                className="accordion-content" 
            >
                {children}
            </div>
        </div>
    )
};

const Accordion = ({children, head}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const triggerId = useId();
    const contentId = useId();
    const contentRef = useRef(null);

    const handleClick = () => {
        setIsExpanded(prevState => !prevState);
    };

    useEffect(() => {
        const contentEl = contentRef.current;
        if (!isExpanded) {
            contentEl.style.maxHeight = "0px";
            contentEl.style.visibility = "hidden";
            contentEl.style.opacity = 0;
            contentEl.style.borderBottomWidth = 0;
            contentEl.style.overflow = "hidden";
        } else {
            contentEl.style.maxHeight = contentEl.scrollHeight + "px";
            contentEl.style.visibility = "visible";
            contentEl.style.opacity = 1;
            contentEl.style.borderBottomWidth = "1px";
            contentEl.style.overflow = "visible";
        }
    }, [children, isExpanded])

    return (
        <div className="accordion">
            <AccordionTrigger 
                id={triggerId}
                isExpanded={isExpanded}
                onClick={() => handleClick()}
                controls={contentId}
                head={head}
            />
            <AccordionContent 
                id={contentId}
                labelledby={triggerId}
                contentRef={contentRef}
            >
                {children}
            </AccordionContent>
        </div>
    )
};

export default Accordion;