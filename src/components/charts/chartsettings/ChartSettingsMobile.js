import { useState } from "react"
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
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

const ChartSettingsMobile = ({ settingsRef, setSelectedChart, setDimensions }) => {

    const { dataAsJSONLength, catColumns, catColumnsLength, numColumns, numColumnsLength, dateOptions } = useData();
    const windowSize = useWindowSize();
    const isMobile = windowSize.width && windowSize.width < 850;
    
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("nav");
    const [settings, setSettings] = useState(settingsRef.current);

    const handleExpandableSideMenuTriggerClick = () => {
        if (menuIsOpen) {
            setActiveTab("nav")
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

    const BackButton = () => (
        <button
            className="side-menu-back-btn"
            type="button"
            onClick={() => setActiveTab("nav")}
            title="Zurück zur Navigation"
        >
            <FaArrowLeft />
        </button>
    );

    const SideMenuContent = ({ children }) => {
        return (
            <div className="side-menu-content">
                <BackButton />
                {children}
            </div>
        )
    };

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

                
                {
                    activeTab === "nav" &&
                    defaultMultiAccordionState.map((state, idx) => (
                        <button
                            key={idx}
                            className="side-menu-link"
                            type="button"
                            onClick={() => setActiveTab(state.name)}
                            title={`Öffnen Konfiguration: ${state.name}`}
                        >
                            {state.name}
                            <FaArrowRightLong />
                        </button>
                    ))
                }

                {
                    activeTab === "Chartoptionen" && (
                        <div className="side-menu-content">
                            <BackButton />
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
                        </div>
                    )
                } 

                {
                    activeTab === "Dimensionen" && (
                        <SideMenuContent>
                            <DimensionSettings
                                settingsRef={settingsRef}
                                setDimensions={setDimensions}
                                settings={settings}
                                setSettings={setSettings}
                            />
                        </SideMenuContent>
                    )
                }

                {
                    activeTab === "Daten" && (
                        <SideMenuContent>
                            <DataSettings
                                settingsRef={settingsRef}
                                settings={settings}
                                setSettings={setSettings}
                            />
                        </SideMenuContent>
                    )
                }

                {
                    activeTab === "Allgemein" && (
                        <SideMenuContent>
                            <GeneralSettings
                                settingsRef={settingsRef}
                                settings={settings}
                                setSettings={setSettings}
                            />
                        </SideMenuContent>
                    )
                }

                {
                    activeTab === "Elemente" && (
                        <SideMenuContent>
                            <ElementSettings
                                settingsRef={settingsRef}
                                settings={settings}
                                setSettings={setSettings}
                            />
                        </SideMenuContent>
                    )
                }

                {
                    activeTab === "Titel" && (
                        <SideMenuContent>
                            <TitelSettings
                                settingsRef={settingsRef}
                                settings={settings}
                                setSettings={setSettings}
                            />
                        </SideMenuContent>
                    )
                }

                {
                    activeTab === "X-Achsenbeschriftung" && (
                        <SideMenuContent>
                            <XAxisSettings
                                settingsRef={settingsRef}
                                settings={settings}
                                setSettings={setSettings}
                            />
                        </SideMenuContent>
                    )
                }

                {
                    activeTab === "Y-Achsenbeschriftung" && (
                        <SideMenuContent>
                            <YAxisSettings
                                settingsRef={settingsRef}
                                settings={settings}
                                setSettings={setSettings}
                            />
                        </SideMenuContent>
                    )
                }

                {
                    activeTab === "Teilstriche und Gitternetz" && (
                        <SideMenuContent>
                            <TickSettings
                                settingsRef={settingsRef}
                                settings={settings}
                                setSettings={setSettings}
                            />
                        </SideMenuContent>
                    )
                }

                {
                    activeTab === "Tooltip" && (
                        <SideMenuContent>
                            <TooltipSettings
                                settingsRef={settingsRef}
                                settings={settings}
                                setSettings={setSettings}
                            />
                        </SideMenuContent>
                    )
                }

                {
                    activeTab === "Download" && (
                        <SideMenuContent>
                            <DownloadSettings
                                settingsRef={settingsRef}
                            />
                        </SideMenuContent>
                    )
                }
            </div>
        )
    } else {
        return <></>
    }
}

export default ChartSettingsMobile