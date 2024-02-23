import { useState, Fragment } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaArrowRightLong } from "react-icons/fa6";

import DimensionSettings from "features/chartsettings/DimensionSettings";
import DataSettings from "features/chartsettings/DataSettings";
import GeneralSettings from "features/chartsettings/GeneralSettings";
import ElementSettings from "features/chartsettings/ElementSettings";
import XAxisSettings from "features/chartsettings/XAxisSettings";
import YAxisSettings from "features/chartsettings/YAxisSettings";
import TickSettings from "features/chartsettings/TickSettings";
import TitelSettings from "features/chartsettings/TitelSettings";
import TooltipSettings from "features/chartsettings/TooltipSettings";
import DownloadSettings from "features/chartsettings/DownloadSettings";
import { useData, useWindowSize } from "hooks";
import { placeholderString, defaultMultiAccordionState, ChartOptions, navigationTabName } from "constants";
import BackButton from "features/chartsettings/BackButton";

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
                activeTab === navigationTabName && (
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
                                        key={state.name+idx}
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
                                        <FaArrowRightLong aria-hidden="true" />
                                    </motion.button>
                                )
                            } else {
                                return (
                                    <Fragment key={state.name+idx}>
                                        {idx === 0 && (
                                            <motion.button
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
                                                <FaArrowRightLong aria-hidden="true" />
                                            </motion.button>
                                        )}
                                    </Fragment>                              
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
                                <BackButton onClick={() => setActiveTab(navigationTabName)} />
                                <p>
                                    Chartoptionen
                                </p>
                            </div>
                        )}
                        <div className={`${isMobile ? "chart-options-mobile" : "chart-options"}`}>
                            {ChartOptions.map((option, key) => (
                                <motion.button
                                    key={option.name+key}
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
                                <BackButton onClick={() => setActiveTab(navigationTabName)} />
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
                                <BackButton onClick={() => setActiveTab(navigationTabName)} />
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
                                <BackButton onClick={() => setActiveTab(navigationTabName)} />
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
                                <BackButton onClick={() => setActiveTab(navigationTabName)} />
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
                                <BackButton onClick={() => setActiveTab(navigationTabName)} />
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
                                <BackButton onClick={() => setActiveTab(navigationTabName)} />
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
                                <BackButton onClick={() => setActiveTab(navigationTabName)} />
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
                                <BackButton onClick={() => setActiveTab(navigationTabName)} />
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
                                <BackButton onClick={() => setActiveTab(navigationTabName)} />
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
                                <BackButton onClick={() => setActiveTab(navigationTabName)} />
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

export default ChartSettings