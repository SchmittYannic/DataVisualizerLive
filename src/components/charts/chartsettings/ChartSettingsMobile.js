import { useEffect, useState, useRef } from "react"
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { RiDragMove2Fill } from "react-icons/ri";
import { FaArrowRightLong } from "react-icons/fa6";
import { useAnimate, stagger, AnimatePresence, motion, useDragControls } from "framer-motion";

import { useData, useWindowSize } from "../../../hooks";
import { defaultMultiAccordionState, placeholderString, ChartOptions } from "../../../constants";
import DimensionSettings from "./DimensionSettings";
import DataSettings from "./DataSettings";
import GeneralSettings from "./GeneralSettings";
import ElementSettings from "./ElementSettings";
import TitelSettings from "./TitelSettings";
import XAxisSettings from "./XAxisSettings";
import YAxisSettings from "./YAxisSettings";
import TooltipSettings from "./TooltipSettings";
import DownloadSettings from "./DownloadSettings";
import TickSettings from "./TickSettings";

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

const ChartSettings = ({ 
    settingsRef,
    setSelectedChart,
    setDimensions,
    activeTab,
    setActiveTab
}) => {

    const { 
        numColumns,
        catColumns,
        dateOptions,
        dataAsJSONLength,
        numColumnsLength,
        catColumnsLength,
        dateColumnsLength,
    } = useData();
    const windowSize = useWindowSize();
    const isMobile = windowSize.width && windowSize.width < 850;

    const [settings, setSettings] = useState(settingsRef.current);

    const selectedChart = settingsRef.current.charttype;

    const initialSlideIn = { x: 500 };
    const animateSlideIn = { x: 0 };
    const exitSlideIn = { x: -500 };

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
        <AnimatePresence>
            {
                activeTab === "nav" && (
                    <>
                        {isMobile && (
                            <div className="expandable-side-menu-content-header">
                                Diagrammkonfiguration
                            </div>
                        )}
                        {defaultMultiAccordionState.map((state, idx) => {
                            if (((selectedChart === "barchart" && dataAsJSONLength > 0 && catColumnsLength > 0)
                            ||  (selectedChart === "piechart" && dataAsJSONLength > 0 && catColumnsLength > 0)
                            || (selectedChart === "boxplot" && dataAsJSONLength > 0 && numColumnsLength > 0)
                            || (selectedChart === "histogram" && dataAsJSONLength > 0 && numColumnsLength > 0)
                            || (selectedChart === "linechart" && dataAsJSONLength > 0 && numColumnsLength > 0 && dateColumnsLength > 0)
                            || (selectedChart === "areachart" && dataAsJSONLength > 0 && numColumnsLength > 0 && dateColumnsLength > 0)
                            || (selectedChart === "scatterplot" && dataAsJSONLength > 0 && numColumnsLength > 0))) {
                                return (
                                    <motion.button
                                        key={idx}
                                        className="side-menu-link"
                                        type="button"
                                        onClick={() => setActiveTab(state.name)}
                                        title={`Öffnen Konfiguration: ${state.name}`}
                                        initial={initialSlideIn}
                                        animate={animateSlideIn}
                                        transition={{ 
                                            delay: 0.1 * idx, 
                                            stiffness: 100 
                                        }}
                                        exit={exitSlideIn}
                                    >
                                        {state.name}
                                        <FaArrowRightLong />
                                    </motion.button>
                                )
                            } else {
                                return (
                                    <>
                                        {idx === 0 && (
                                            <motion.button
                                                key={idx}
                                                className="side-menu-link"
                                                type="button"
                                                onClick={() => setActiveTab(state.name)}
                                                title={`Öffnen Konfiguration: ${state.name}`}
                                                initial={initialSlideIn}
                                                animate={animateSlideIn}
                                                transition={{ 
                                                    delay: 0.1 * idx, 
                                                    stiffness: 100 
                                                }}
                                                exit={exitSlideIn}
                                            >
                                                {state.name}
                                                <FaArrowRightLong />
                                            </motion.button>
                                        )}
                                    </>
                                )
                            }
                        })}
                    </>
                )
            }
            

            {
                activeTab === "Chartoptionen" && (
                    <div className="side-menu-content">
                        {isMobile && (
                            <div className="side-menu-content-header">
                                <BackButton onClick={() => setActiveTab("nav")} />
                                <p>
                                    Chartoptionen
                                </p>
                            </div>
                        )}
                        <div className={`${isMobile ? "chart-options-mobile" : "chart-options"}`}>
                            {ChartOptions.map((option, key) => (
                                <motion.button
                                    key={key}
                                    type="button"
                                    className={`${isMobile ? "btn" : "btn full"}`}
                                    onClick={()=>handleSelectChart(option.action)}
                                    title={`Wechsel zu ${option.name}`}
                                    initial={initialSlideIn}
                                    animate={animateSlideIn}
                                    transition={{ 
                                        delay: 0.1 * key, 
                                        stiffness: 100 
                                    }}
                                    exit={exitSlideIn}
                                >
                                    {isMobile ? option.icon : option.name}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                )
            } 

            {
                activeTab === "Dimensionen" && (
                    <div className="side-menu-content">
                        {isMobile && (
                            <div className="side-menu-content-header">
                                <BackButton onClick={() => setActiveTab("nav")} />
                                <p>
                                    Dimensionen
                                </p>
                            </div>
                        )}

                        <DimensionSettings
                            settingsRef={settingsRef}
                            setDimensions={setDimensions}
                            settings={settings}
                            setSettings={setSettings}
                        />
                    </div>
                )
            }

            {
                activeTab === "Daten" && (
                    <div className="side-menu-content">
                        {isMobile && (
                            <div className="side-menu-content-header">
                                <BackButton onClick={() => setActiveTab("nav")} />
                                <p>
                                    Daten
                                </p>
                            </div>
                        )}

                        <DataSettings
                            settingsRef={settingsRef}
                            settings={settings}
                            setSettings={setSettings}
                        />
                    </div>
                )
            }

            {
                activeTab === "Allgemein" && (
                    <div className="side-menu-content">
                        {isMobile && (
                            <div className="side-menu-content-header">
                                <BackButton onClick={() => setActiveTab("nav")} />
                                <p>
                                    Allgemein
                                </p>
                            </div>
                        )}

                        <GeneralSettings
                            settingsRef={settingsRef}
                            settings={settings}
                            setSettings={setSettings}
                        />
                    </div>
                )
            }

            {
                activeTab === "Elemente" && (
                    <div className="side-menu-content">
                        {isMobile && (
                            <div className="side-menu-content-header">
                                <BackButton onClick={() => setActiveTab("nav")} />
                                <p>
                                    Elemente
                                </p>
                            </div>
                        )}

                        <ElementSettings
                            settingsRef={settingsRef}
                            settings={settings}
                            setSettings={setSettings}
                        />
                    </div>
                )
            }

            {
                activeTab === "Titel" && (
                    <div className="side-menu-content">
                        {isMobile && (
                            <div className="side-menu-content-header">
                                <BackButton onClick={() => setActiveTab("nav")} />
                                <p>
                                    Titel
                                </p>
                            </div>
                        )}

                        <TitelSettings
                            settingsRef={settingsRef}
                            settings={settings}
                            setSettings={setSettings}
                        />
                    </div>
                )
            }

            {
                activeTab === "X-Achsenbeschriftung" && (
                    <div className="side-menu-content">
                        {isMobile && (
                            <div className="side-menu-content-header">
                                <BackButton onClick={() => setActiveTab("nav")} />
                                <p>
                                    X-Achsenbeschriftung
                                </p>
                            </div>
                        )}

                        <XAxisSettings
                            settingsRef={settingsRef}
                            settings={settings}
                            setSettings={setSettings}
                        />
                    </div>
                )
            }

            {
                activeTab === "Y-Achsenbeschriftung" && (
                    <div className="side-menu-content">
                        {isMobile && (
                            <div className="side-menu-content-header">
                                <BackButton onClick={() => setActiveTab("nav")} />
                                <p>
                                    Y-Achsenbeschriftung
                                </p>
                            </div>
                        )}

                        <YAxisSettings
                            settingsRef={settingsRef}
                            settings={settings}
                            setSettings={setSettings}
                        />
                    </div>
                )
            }

            {
                activeTab === "Teilstriche und Gitternetz" && (
                    <div className="side-menu-content">
                        {isMobile && (
                            <div className="side-menu-content-header">
                                <BackButton onClick={() => setActiveTab("nav")} />
                                <p>
                                    Teilstriche und Gitternetz
                                </p>
                            </div>
                        )}

                        <TickSettings
                            settingsRef={settingsRef}
                            settings={settings}
                            setSettings={setSettings}
                        />
                    </div>
                )
            }

            {
                activeTab === "Tooltip" && (
                    <div className="side-menu-content">
                        {isMobile && (
                            <div className="side-menu-content-header">
                                <BackButton onClick={() => setActiveTab("nav")} />
                                <p>
                                    Tooltip
                                </p>
                            </div>
                        )}

                        <TooltipSettings
                            settingsRef={settingsRef}
                            settings={settings}
                            setSettings={setSettings}
                        />
                    </div>
                )
            }

            {
                activeTab === "Download" && (
                    <div className="side-menu-content">
                        {isMobile && (
                            <div className="side-menu-content-header">
                                <BackButton onClick={() => setActiveTab("nav")} />
                                <p>
                                    Download
                                </p>
                            </div>
                        )}

                        <DownloadSettings
                            settingsRef={settingsRef}
                        />
                    </div>
                )
            }
        </AnimatePresence>
    )
}

export const ChartSettingsMobile = ({ settingsRef, setSelectedChart, setDimensions }) => {

    const { dataAsJSONLength } = useData();
    
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("nav");
    const [scope, animate] = useAnimate();

    const handleExpandableSideMenuTriggerClick = () => {
        if (menuIsOpen) {
            setActiveTab("nav")
            setMenuIsOpen(false)
        } else {
            setMenuIsOpen(true);
        }
    };

    useEffect(() => {
        animate(
            "button",
            menuIsOpen
              ? { x: 0, }
              : { x: -500 },
            {
              duration: 0.2,
              delay: menuIsOpen ? stagger(0.1, { startDelay: 0.15 }) : 0,
            }
        );
    }, [menuIsOpen, animate]);

    if (dataAsJSONLength > 0) {
        return (
            <div className={`expandable-side-menu ${menuIsOpen ? "expanded" : ""}`}>
                <div className="expandable-side-menu-trigger-wrapper">
                    <button
                        className="expandable-side-menu-trigger"
                        type="button"
                        onClick={handleExpandableSideMenuTriggerClick}
                        title={`${menuIsOpen ? "Diagrammkonfiguration schließen" : "Diagrammkonfiguration öffnen"}`}
                    >
                        <FaArrowRight />
                    </button>
                </div>
                <div className="inverted-corner" />

                <div ref={scope} className="expandable-side-menu-content">
                    
                    <ChartSettings 
                        settingsRef={settingsRef}
                        setSelectedChart={setSelectedChart}
                        setDimensions={setDimensions}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                    
                </div>
            </div>
        )
    } else {
        return <></>
    }
}

export const ChartSettingsDesktop = ({ settingsRef, setSelectedChart, setDimensions, setIsOpen }) => {
    const { dataAsJSONLength } = useData();
    const controls = useDragControls();
    const draggableRef = useRef(null);

    const [activeTab, setActiveTab] = useState("nav");

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
        y: body.scrollHeight / 2 - 380, 
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
                    bottom: maxHeight - 760,
                    right: maxWidth- 400,
                }}
                dragElastic={0}
                initial={{ 
                    opacity: 1,
                    x: settingsDefaultPosition.x,
                    y: settingsDefaultPosition.y,
                }}
                exit={{ 
                    opacity: 0, 
                    x: body.scrollWidth/2 - settingsCurrentPosition.x,
                    y: body.scrollHeight/2 - settingsCurrentPosition.y,
                }}
                transition={{ duration: 1}}
            >
                <div className="draggable-wrapper">
                    <div 
                        className="draggable" 
                        onPointerDown={startDrag}>
                        {activeTab === "nav" ? (
                            <div className="draggable-icon">
                                <RiDragMove2Fill />
                            </div>
                        ): (
                            <div className="draggable-back-btn">
                                <BackButton onClick={() => setActiveTab("nav")} />
                            </div>
                        )}
                        
                        {activeTab}
                    </div>

                    <button 
                        className="draggable-close"
                        type="button"
                        title="Diagrammkonfiguration schließen"
                        onClick={handleDragableClose}
                    />
                </div>
                
                <div className="draggable-menu-content">
                    <ChartSettings 
                        settingsRef={settingsRef}
                        setSelectedChart={setSelectedChart}
                        setDimensions={setDimensions}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                </div>
            </motion.div>
        )
    } else {
        return <></>
    }
};