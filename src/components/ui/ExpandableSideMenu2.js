import React, { useState, useId, useRef, useEffect, forwardRef } from "react"
import { FaArrowRight } from "react-icons/fa";
import DropdownIcon from "./icons/DropdownIcon";

const AccordionTrigger = (props) => {
    return (
        <button {...props}>
            {props.children}
            <DropdownIcon classes={`accordion-trigger-svg ${props.isExpanded ? "open" : ""}`} />
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

const Accordion = ({ head, children, isExpanded, onClick }) => {

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
                isExpanded={isExpanded}
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

const MultiAccordion = ({ multiAccordionsState, toggleAccordionStateIsExpanded, children }) => {
    return (
        <>
            {children.map((child, idx) => {
                const accordionState = multiAccordionsState.find(state => state.id === idx)
                const otherStates = multiAccordionsState.filter(state => state.id !== idx)

                const handleAccordionTriggerClick = () => {
                    otherStates.forEach((state) => {
                        if (state.isExpanded) {
                            toggleAccordionStateIsExpanded(state, state.id);
                        }
                    })
                    toggleAccordionStateIsExpanded(accordionState, idx);
                };

                return (
                    <Accordion
                        key={idx}
                        head={"test"}
                        isExpanded={accordionState.isExpanded}
                        onClick={handleAccordionTriggerClick}
                    >
                        {child}
                    </Accordion>
                )
            })}
        </>
    )
};

const ExpandableSideMenu2 = ({ children }) => {
    const [menuIsOpen, setMenuIsOpen] = useState(true);
    const defaultMultiAccordionsState = children.map((child, idx) => {
        return {
            id: idx,
            accordion: child,
            isExpanded: false,
        }
    })
    const [multiAccordionsState, setMultiAccordionsState] = useState(defaultMultiAccordionsState);

    const toggleAccordionStateIsExpanded = (accordionState, idx) => {
        setMultiAccordionsState((prevState) => {
            const newState = [...prevState];
            const copyAccordionState = {...accordionState};
            copyAccordionState.isExpanded = !copyAccordionState.isExpanded;
            newState[idx] = copyAccordionState;
            return newState
        })
    };

    const handleExpandableSideMenuTriggerClick = () => {
        if (menuIsOpen) {
            multiAccordionsState.forEach((accordionState, idx) => {
                if(accordionState.isExpanded) {
                    toggleAccordionStateIsExpanded(accordionState, idx);
                }
            });
            setMenuIsOpen(false)
        } else {
            setMenuIsOpen(true);
        }
    };

    return (
        <div className={`expandable-side-menu ${menuIsOpen ? "expanded" : ""}`}>
            <button
                className="expandable-side-menu-trigger"
                type="button"
                onClick={handleExpandableSideMenuTriggerClick}
            >
                <FaArrowRight />
            </button>

            <MultiAccordion
                multiAccordionsState={multiAccordionsState}
                toggleAccordionStateIsExpanded={toggleAccordionStateIsExpanded}
            >
                {children}
            </MultiAccordion>
        </div>
    )
}

export default ExpandableSideMenu2