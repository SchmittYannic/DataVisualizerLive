import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Barchart, Piechart, Boxplot, Histogram, Scatterplot, Linechart, Areachart, ChartSettings } from "./charts";
import { useData } from "../hooks";
import { saveSvg } from "./charts/saveSvg";
import { renderChart } from "./charts/renderChart";
import { InfoBox } from "./ui";

const VisualizationStep = () => {
    const { dataAsJSON, catColumns, fileIsUploaded } = useData();

    const defaultDimensions = {
        svgWidth: 1000,
        svgHeight: 600,
        svgMarginLeft: 180,
        svgMarginTop: 120,
        svgMarginRight: 180,
        svgMarginBottom: 120,
    };
    
    const defaultSettings = {
        charttype: "barchart",
        dimensions: defaultDimensions,
        dataInput: {
            xColumn: catColumns[0],
            yColumn: "",
            zGrouping: "",
        },
        general: {
            fontFamily: "Segoe UI",
            svgBg: {
                r: "255",
                g: "255",
                b: "255",
                a: "1",
            },
        },
        chartelements: {
            colorscheme: "category10",
            circleOpacity: 0.5,
            circleRadius: 5,
            binNumber: 10,
            binColor: {
                r: "31",
                g: "119",
                b: "180",
                a: "1",
            },
            pointColor: {
                r: "0",
                g: "0",
                b: "0",
                a: "1",
            },
            lineColor: {
                r: "31",
                g: "119",
                b: "180",
                a: "1",
            },
            lineWidth: 2,
            areaColor: {
                r: "31",
                g: "119",
                b: "180",
                a: "0.4",
            },
        },
        label: {
            titleText: `Absolute Häufigkeiten der Kategorien aus ${catColumns[0]}`,
            titleDistance: 60,
            titleFontSize: 20,
            titleColor: {
                r: "99",
                g: "79",
                b: "93",
                a: "1",
            },
            xaxisText: "Kategorien",
            xaxisDistance: 100,
            xaxisFontSize: 20,
            xaxisColor: {
                r: "142",
                g: "136",
                b: "131",
                a: "1",
            },
            yaxisText: "Absolute Häufigkeiten",
            yaxisDistance: 100,
            yaxisFontSize: 20,
            yaxisColor: {
                r: "142",
                g: "136",
                b: "131",
                a: "1",
            },
        },
        tick: {
            tickFontSize: "13",
            tickTextColor: {
                r: "99",
                g: "95",
                b: "93",
                a: "1",
            },
            tickLineWidth: "1",
            tickLineColor: {
                r: "99",
                g: "95",
                b: "93",
                a: "1",
            },
        },
        tooltip: {
            tooltipFontSize: "10",
            tooltipTextColor: {
                r: "99",
                g: "95",
                b: "93",
                a: "1",
            },
            tooltipBgColor: {
                r: "248",
                g: "243",
                b: "243",
                a: "1",
            },
        }
    };

    const [selectedChart, setSelectedChart] = useState("barchart");   
    const [isSettingsOpen, setIsSettingsOpen] = useState(true);
    
    const [dimensions, setDimensions] = useState(defaultDimensions);
    const settingsRef = useRef(defaultSettings);

    useEffect(() => {
        if (catColumns.length > 0) {
            settingsRef.current.dataInput.xColumn = catColumns[0];
            settingsRef.current.label.titleText = `Absolute Häufigkeiten der Kategorien aus ${catColumns[0]}`;

            renderChart(settingsRef, dataAsJSON);
        }
    }, [catColumns, dataAsJSON]);

    if (fileIsUploaded) {
        return (
            <>
                <main className="main-visualization">
                    {/* <h2 className="step-header">Visualization Step</h2> */}

                    { selectedChart === "barchart" && <Barchart dimensions={dimensions} settingsRef={settingsRef} />}
                    { selectedChart === "piechart" && <Piechart dimensions={dimensions} settingsRef={settingsRef} />}
                    { selectedChart === "boxplot" && <Boxplot dimensions={dimensions} settingsRef={settingsRef} />}
                    { selectedChart === "histogram" && <Histogram dimensions={dimensions} settingsRef={settingsRef} />}
                    { selectedChart === "scatterplot" && <Scatterplot dimensions={dimensions} settingsRef={settingsRef} />}
                    { selectedChart === "linechart" && <Linechart dimensions={dimensions} settingsRef={settingsRef} />}
                    { selectedChart === "areachart" && <Areachart dimensions={dimensions} settingsRef={settingsRef} />}

                    <AnimatePresence>
                        {   
                            isSettingsOpen &&
                            
                                <ChartSettings 
                                    settingsRef={settingsRef}
                                    setSelectedChart={setSelectedChart}
                                    setDimensions={setDimensions}
                                    setIsOpen={setIsSettingsOpen}
                                />
                        }
                    </AnimatePresence>
                </main>

                <div id="nav-wrapper-visualization" className="navigation-wrapper">
                    <Link 
                        className="btn"
                        title="Zurück zur Datenansicht"
                        to={`/DataVisualizer/DataStep`}
                    >
                        Zurück
                    </Link>

                    <AnimatePresence>
                        {
                            !isSettingsOpen &&
                                <motion.div
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    transition={{delay: 1}}
                                >
                                    <button
                                        className="btn"
                                        type="button"
                                        title="Öffnen der Diagrammkonfiguration"
                                        onClick={() => setIsSettingsOpen((prev) => !prev)}
                                    >
                                        Diagrammkonfiguration
                                    </button>
                                </motion.div>
                        }
                    </AnimatePresence>

                    <button
                        className="next-btn btn"
                        type="button"
                        title="Herunterladen des angezeigten Diagramms im SVG-Format"
                        onClick={() => {
                            const charttype = settingsRef.current.charttype
                            const svgEl = document.getElementById(`${charttype}SVG`);
                            if (svgEl) {
                                saveSvg(svgEl, charttype);
                            } else {
                                alert("Kein svg zum Herunterladen erkannt. Falls Ihnen kein Diagramm angezeigt wird, versuchen Sie in der Diagrammkonfiguration unter Diagrammoptionen einen anderen Diagrammtypen zu wählen.")
                            }
                        }}
                    >
                        Download svg
                    </button>
                </div>
            </>
        )
    } else {
        return (
            <InfoBox>
                <p>Laden Sie bitte zuerst einen Datensatz hoch, ansonsten können Sie nicht fortfahren.</p>
                <p>Falls Sie keinen geeigneten Datensatz zur Verfügung haben, können Sie das Tool durch die Demodatensätze auf der Uploadseite ausprobieren.</p>
                <div style={{display: "flex", justifyContent: "flex-end", gap: "1em"}}>
                    <Link
                        className="btn next-btn"
                        title="Link zur Uploadseite"
                        to={`/DataVisualizer/UploadStep`}
                    >
                        zum Upload
                    </Link>
                </div>
            </InfoBox>
        )
    }
}

export default VisualizationStep