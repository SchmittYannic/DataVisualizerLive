import { motion, useDragControls } from "framer-motion";
import { useState, useRef } from "react"
import { FaArrowRight } from "react-icons/fa";
import { RiDragMove2Fill } from "react-icons/ri";

import { useData, useMultiAccordionContext, useWindowSize } from "../../../hooks";
import { ChartOptions, placeholderString } from "../../../constants";
import { Accordion } from "../../ui";
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

const ChartSettings = ({ 
    settingsRef,
    setSelectedChart,
    setDimensions,
}) => {

    const { dataAsJSONLength, catColumns, catColumnsLength , numColumns, numColumnsLength, dateOptions, dateColumnsLength } = useData();
    const { multiAccordionsState, toggleAccordionStateIsExpanded } = useMultiAccordionContext();
    const windowSize = useWindowSize();
    const isMobile = windowSize.width && windowSize.width < 850;
    const [settings, setSettings] = useState(settingsRef.current);
    const selectedChart = settingsRef.current.charttype;

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

    return (
        <>
            <Accordion
                head="Diagrammoptionen"
                isExpanded={multiAccordionsState[0].isExpanded}
                onClick={() => handleAccordionTriggerClick(0)}
            >
                <div className={`${isMobile ? "chart-options-mobile" : "chart-options"}`}>
                    {ChartOptions.map((option, key) => (
                        <button
                            key={key}
                            type="button"
                            className={`${isMobile ? "btn" : "btn full"}`}
                            onClick={()=>handleSelectChart(option.action)}
                            title={`Wechsel zu ${option.name}`}
                        >
                            {isMobile ? option.icon : option.name}
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
        </>
    )
}

const ChartSettingsMobile = ({ settingsRef, setSelectedChart, setDimensions }) => {

    const { multiAccordionsState, toggleAccordionStateIsExpanded } = useMultiAccordionContext();
    const [menuIsOpen, setMenuIsOpen] = useState(false);

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
            <div className="expandable-side-menu-trigger-wrapper">
                <button
                    className="expandable-side-menu-trigger"
                    type="button"
                    onClick={handleExpandableSideMenuTriggerClick}
                >
                    <FaArrowRight />
                </button>
            </div>
            <div className="inverted-corner" />

            <ChartSettings
                settingsRef={settingsRef}
                setSelectedChart={setSelectedChart}
                setDimensions={setDimensions}
                multiAccordionsState={multiAccordionsState}
                toggleAccordionStateIsExpanded={toggleAccordionStateIsExpanded}
            />
        </div>
    )
}

const ChartSettingsDesktop = ({ settingsRef, setSelectedChart, setDimensions, setIsOpen }) => {
    const { dataAsJSONLength } = useData();
    const { multiAccordionsState, toggleAccordionStateIsExpanded } = useMultiAccordionContext();
    const controls = useDragControls();
    const draggableRef = useRef(null);

    // get body and html element
    const body = document.body;
    const html = document.documentElement;
    //calculate maxHeight and maxWidth to use as dragConstraints
    const maxHeight = Math.max( body.scrollHeight, body.offsetHeight, 
        html.clientHeight, html.scrollHeight, html.offsetHeight );
    const maxWidth = Math.max( body.scrollWidth, body.offsetWidth,
        html.clientWidth, html.scrollWidth, html.offsetWidth );
    
    //default position of chart-settings container
    const settingsDefaultPosition = {
        y: body.scrollHeight / 2 - 200, 
        x: body.scrollWidth / 2 - 200
    };
    //initialize settingsCurrentPosition
    const settingsCurrentPosition = {
        y: 0,
        x: 0,
    };

    const startDrag = (event) => {
        controls.start(event)
    };

    const handleDragableClose = () => {
        setIsOpen((prev) => !prev);

        //get current transform style of draggable element chart-settings
        //string looks like this: translateX(1265px) translateY(138.309px) translateZ(0px)
        const string = draggableRef.current.style.transform;
        //use regex to get the values inside the translateX and translateY parentheses
        const regexTranslateX = /translateX\((.*?)px\)/;
        const regexTranslateY = /translateY\((.*?)px\)/;
        const matchTranslateX = string.match(regexTranslateX);
        const matchTranslateY = string.match(regexTranslateY);
        //save the current position of settings
        settingsCurrentPosition.x = matchTranslateX ? matchTranslateX[1] : 0;
        settingsCurrentPosition.y = matchTranslateY ? matchTranslateY[1] : 0;
    };

    if (dataAsJSONLength > 0) {
        return (
            <motion.div
                className="chart-settings"
                ref={draggableRef}
                drag
                dragControls={controls}
                dragListener={false}
                dragConstraints={{
                    top: 0,
                    left: 0,
                    bottom: maxHeight,
                    right: maxWidth,
                }}
                dragElastic={0}
                initial={{ 
                    opacity: 1,
                    x: settingsDefaultPosition.x,
                    y: settingsDefaultPosition.y,
                }}
                exit={{ 
                    opacity: 0, 
                    x: body.scrollWidth/2 - settingsCurrentPosition.x - 200,
                    y: body.scrollHeight/2 - settingsCurrentPosition.y,
                }}
                transition={{ duration: 1}}
            >
                <div className="draggable-wrapper">
                    <div 
                        className="draggable" 
                        onPointerDown={startDrag}>
                        <div className="draggable-icon">
                            <RiDragMove2Fill />
                        </div>
                        Diagrammkonfiguration
                    </div>

                    <button 
                        className="draggable-close"
                        type="button"
                        title="Diagrammkonfiguration schließen"
                        onClick={handleDragableClose}
                    />
                </div>
                
                <ChartSettings
                    settingsRef={settingsRef}
                    setSelectedChart={setSelectedChart}
                    setDimensions={setDimensions}
                    multiAccordionsState={multiAccordionsState}
                    toggleAccordionStateIsExpanded={toggleAccordionStateIsExpanded}
                />
            </motion.div>
        )
    }
};

export {
    ChartSettingsMobile,
    ChartSettingsDesktop,
}