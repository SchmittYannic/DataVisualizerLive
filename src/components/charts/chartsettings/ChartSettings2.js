import React, { useState, useId, useRef, useEffect, forwardRef } from "react"
import { FaArrowRight } from "react-icons/fa";
import { DropdownIcon } from "../../ui/icons/";
import { useData } from "../../../hooks";
import { ChartOptions, placeholderString } from "../../../constants";
import { 
    DimensionSettings,
    DataSettings,
    GeneralSettings,
    ElementSettings,
    TitelSettings,
    AxisSettings,
    TickSettings,
    TooltipSettings,
    DownloadSettings,
} from "./";

const AccordionTrigger = (props) => {
    return (
        <button {...props}>
            {props.children}
            <DropdownIcon classes={`accordion-trigger-svg ${props["aria-expanded"] ? "open" : ""}`} />
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

const ChartSettings2 = ({ settingsRef, setSelectedChart, setDimensions }) => {

    const { dataAsJSONLength, catColumns, catColumnsLength , numColumns, numColumnsLength, dateOptions, dateColumnsLength } = useData();
    const [settings, setSettings] = useState(settingsRef.current);
    const selectedChart = settingsRef.current.charttype;

    const [menuIsOpen, setMenuIsOpen] = useState(true);
    const [multiAccordionsState, setMultiAccordionsState] = useState([
        {
            id: 0,
            name: "ChartSettings",
            isExpanded: false,
            component:
                <></>,
        },
        {
            id: 1,
            name: "Dimensionen",
            isExpanded: false,
        },
        {
            id: 2,
            name: "Daten",
            isExpanded: false,
        },
        {
            id: 3,
            name: "Allgemein",
            isExpanded: false,
        },
        {
            id: 4,
            name: "Elemente",
            isExpanded: false,
        },
        {
            id: 5,
            name: "Titel",
            isExpanded: false,
        },
        {
            id: 6,
            name: "Achsenbeschriftung",
            isExpanded: false,
        },
        {
            id: 7,
            name: "Teilstriche und Gitternetz",
            isExpanded: false,
        },
        {
            id: 8,
            name: "Tooltip",
            isExpanded: false,
        },
        {
            id: 9,
            name: "Download",
            isExpanded: false,
        },
    ]);

    const toggleAccordionStateIsExpanded = (accordionState, idx) => {
        setMultiAccordionsState((prevState) => {
            const newState = [...prevState];
            const copyAccordionState = {...accordionState};
            copyAccordionState.isExpanded = !copyAccordionState.isExpanded;
            newState[idx] = copyAccordionState;
            return newState
        })
    };

    const handleAccordionTriggerClick = (idx) => {
        const accordionState = multiAccordionsState[idx];
        const otherStates = multiAccordionsState.filter(state => state.id !== idx);

        otherStates.forEach((state) => {
            if (state.isExpanded) {
                toggleAccordionStateIsExpanded(state, state.id);
            }
        });
        toggleAccordionStateIsExpanded(accordionState, idx);
    }

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

    const handleSelectChart = (input) => {
        const newRef = { ...settingsRef.current };
        newRef.charttype = input;

        switch (input) {
            case "barchart":
                newRef.dataInput.xColumn = catColumnsLength > 0 ? catColumns[0] : "";
                newRef.label.titleText = `Absolute Häufigkeiten der Kategorien aus ${newRef.dataInput.xColumn}`;
                newRef.label.xaxisText = "Kategorien";
                newRef.label.yaxisText = "Absolute Häufigkeit";
                break;
            case "piechart":
                newRef.dataInput.xColumn = catColumnsLength > 0 ? catColumns[0] : "";
                newRef.label.titleText = `Relative Häufigkeiten der Kategorien aus ${newRef.dataInput.xColumn}`;
                newRef.label.xaxisText = "Kategorien";
                newRef.label.yaxisText = "Relative Häufigkeit";
                break;
            case "boxplot":
                newRef.dataInput.xColumn = numColumnsLength > 0 ? numColumns[0] : "";
                newRef.dataInput.zGrouping = placeholderString;
                newRef.label.titleText = `Boxplot von ${newRef.dataInput.xColumn}`;
                newRef.label.xaxisText = "";
                newRef.label.yaxisText = `${newRef.dataInput.xColumn}`;
                break;
            case "scatterplot":
                newRef.dataInput.xColumn = numColumnsLength > 0 ? numColumns[0] : "";
                newRef.dataInput.yColumn = numColumnsLength > 1 ? numColumns[1] : numColumnsLength > 0 ? numColumns[0] : "";
                newRef.dataInput.zGrouping = placeholderString;
                newRef.label.titleText = `Zusammenhang zwischen ${newRef.dataInput.xColumn} und ${newRef.dataInput.yColumn}`;
                newRef.label.xaxisText = `${newRef.dataInput.xColumn}`;
                newRef.label.yaxisText = `${newRef.dataInput.yColumn}`;
                break;
            case "histogram":
                newRef.dataInput.xColumn = numColumnsLength > 0 ? numColumns[0] : "";
                newRef.label.titleText = `Häufigkeitsverteilung von ${newRef.dataInput.xColumn}`;
                newRef.label.xaxisText = "Klassen";
                newRef.label.yaxisText = "absolute Häufigkeit";
                break;
            case "linechart":
                newRef.dataInput.xColumn = dateOptions.length > 0 ? dateOptions[0] : "";
                newRef.dataInput.yColumn = numColumnsLength > 0 ? numColumns[0] : "";
                newRef.label.titleText = `Verlauf von ${newRef.dataInput.yColumn} anhand von ${newRef.dataInput.xColumn}`;
                newRef.label.xaxisText = `${newRef.dataInput.xColumn}`;
                newRef.label.yaxisText = `${newRef.dataInput.yColumn}`;
                break;
            case "areachart":
                newRef.dataInput.xColumn = dateOptions.length > 0 ? dateOptions[0] : "";
                newRef.dataInput.yColumn = numColumnsLength > 0 ? numColumns[0] : "";
                newRef.label.titleText = `Verlauf von ${newRef.dataInput.yColumn} anhand von ${newRef.dataInput.xColumn}`;
                newRef.label.xaxisText = `${newRef.dataInput.xColumn}`;
                newRef.label.yaxisText = `${newRef.dataInput.yColumn}`;
                break;
            default:
                throw Error("unknown charttype as input of function handleSelectChart in Component ChartSettings");
        };

        settingsRef.current = newRef;
        setSelectedChart(input);
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

            <Accordion
                head="Diagrammoptionen"
                isExpanded={multiAccordionsState[0].isExpanded}
                onClick={() => handleAccordionTriggerClick(0)}
            >
                <div className="chart-options">
                    {ChartOptions.map((option, key) => (
                        <button
                            key={key}
                            type="button"
                            className="btn full"
                            onClick={()=>handleSelectChart(option.action)}
                        >
                            {option.name}
                        </button>
                    ))}
                </div>
            </Accordion>

            {   
                ((selectedChart === "barchart" && dataAsJSONLength > 0 && catColumnsLength > 0)
                ||  (selectedChart === "piechart" && dataAsJSONLength > 0 && catColumnsLength > 0)
                || (selectedChart === "boxplot" && dataAsJSONLength > 0 && numColumnsLength > 0)
                || (selectedChart === "histogram" && dataAsJSONLength > 0 && numColumnsLength > 0)
                || (selectedChart === "linechart" && dataAsJSONLength > 0 && numColumnsLength > 0 && dateColumnsLength > 0)
                || (selectedChart === "areachart" && dataAsJSONLength > 0 && numColumnsLength > 0 && dateColumnsLength > 0)
                || (selectedChart === "scatterplot" && dataAsJSONLength > 0 && numColumnsLength > 0))
            
                &&
                <>
                    <Accordion
                        head="Dimensionen"
                        isExpanded={multiAccordionsState[1].isExpanded}
                        onClick={() => handleAccordionTriggerClick(1)}
                    >
                        <DimensionSettings
                            settingsRef={settingsRef}
                            setDimensions={setDimensions}
                            settings={settings}
                            setSettings={setSettings}
                        />
                    </Accordion>

                    <Accordion
                        head="Daten"
                        isExpanded={multiAccordionsState[2].isExpanded}
                        onClick={() => handleAccordionTriggerClick(2)}
                    >
                        <DataSettings
                            settingsRef={settingsRef}
                            settings={settings}
                            setSettings={setSettings}
                        />
                    </Accordion>

                    <Accordion
                        head="Allgemein"
                        isExpanded={multiAccordionsState[3].isExpanded}
                        onClick={() => handleAccordionTriggerClick(3)}
                    >
                        <GeneralSettings
                            settingsRef={settingsRef}
                            settings={settings}
                            setSettings={setSettings}
                        />
                    </Accordion>

                    <Accordion
                        head="Elemente"
                        isExpanded={multiAccordionsState[4].isExpanded}
                        onClick={() => handleAccordionTriggerClick(4)}
                    >
                        <ElementSettings
                            settingsRef={settingsRef}
                            settings={settings}
                            setSettings={setSettings}
                        />
                    </Accordion>

                    <Accordion
                        head="Titel"
                        isExpanded={multiAccordionsState[5].isExpanded}
                        onClick={() => handleAccordionTriggerClick(5)}
                    >
                        <TitelSettings
                            settingsRef={settingsRef}
                            settings={settings}
                            setSettings={setSettings}
                        />
                    </Accordion>

                    <Accordion
                        head="Achsenbeschriftung"
                        isExpanded={multiAccordionsState[6].isExpanded}
                        onClick={() => handleAccordionTriggerClick(6)}
                    >
                        <AxisSettings
                            settingsRef={settingsRef}
                            settings={settings}
                            setSettings={setSettings}
                        />
                    </Accordion>

                    <Accordion
                        head="Teilstriche und Gitternetz"
                        isExpanded={multiAccordionsState[7].isExpanded}
                        onClick={() => handleAccordionTriggerClick(7)}
                    >
                        <TickSettings
                            settingsRef={settingsRef}
                            settings={settings}
                            setSettings={setSettings}
                        />
                    </Accordion>

                    <Accordion
                        head="Tooltip"
                        isExpanded={multiAccordionsState[8].isExpanded}
                        onClick={() => handleAccordionTriggerClick(8)}
                    >
                        <TooltipSettings
                            settingsRef={settingsRef}
                            settings={settings}
                            setSettings={setSettings}
                        />
                    </Accordion>

                    <Accordion
                        head="Download"
                        isExpanded={multiAccordionsState[9].isExpanded}
                        onClick={() => handleAccordionTriggerClick(9)}
                    >
                        <DownloadSettings
                            settingsRef={settingsRef}
                        />
                    </Accordion>
                </>
            }
        </div>
    )
}

export default ChartSettings2