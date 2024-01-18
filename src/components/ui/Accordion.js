import { useEffect, useId, useRef, forwardRef } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

import "./Accordion.css";

const AccordionTrigger = (props) => {
    return (
        <button {...props}>
            {props.children}
            <MdKeyboardArrowDown
                className={`accordion-trigger-svg ${props["aria-expanded"] ? "open" : ""}`}
            />
        </button>
    )
}

const AccordionContent = forwardRef((props, ref) => {
    return (
        <div {...props} ref={ref}>
            <div
                className="accordion-content" 
            >
                {props.children}
            </div>
        </div>
    )
})

const Accordion = ({ head, isExpanded, onClick, children }) => {

    const triggerId = useId();
    const contentId = useId();
    const contentRef = useRef(null);

    useEffect(() => {
        const contentEl = contentRef.current;
        if(!contentEl) return
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
                className={`accordion-trigger ${isExpanded ? "expanded" : ""}`}
                type="button"
                onClick={onClick}
                aria-expanded={isExpanded}
                aria-controls={contentId}
            >
                {head}
            </AccordionTrigger>
            <AccordionContent
                id={contentId}
                className="accordion-content-wrapper"
                ref={contentRef}
                aria-labelledby={triggerId}
            >
                {children}
            </AccordionContent>
        </div>
    )
}

export default Accordion;