import ChartSettingsItem from "./ChartSettingsItem";
import { saveSvg } from "features/charts/saveSvg";
import { barchartScript } from "features/charts/barchart/BarchartLogic";
import { areachartScript } from "features/charts/areachart/AreachartLogic";
import { linechartScript } from "features/charts/linechart/LinechartLogic";
import { boxplotScript } from "features/charts/boxplot/BoxplotLogic";
import { histogramScript } from "features/charts/histogram/HistogramLogic";
import { piechartScript } from "features/charts/piechart/PiechartLogic";
import { scatterplotScript } from "features/charts/scatterplot/ScatterplotLogic";

const DownloadSettings = ({ settingsRef }) => {

    const copyChartHtml = () => {
        const chartToolTipWrapper = document.getElementById("chart-tt-wrapper");
        const chartWrapper = document.getElementById(settingsRef.current.charttype);
        const outerHTML = chartToolTipWrapper.outerHTML + chartWrapper.outerHTML;

        const scripts = {
            "areachart": areachartScript,
            "barchart": barchartScript,
            "boxplot": boxplotScript,
            "histogram": histogramScript,
            "linechart": linechartScript,
            "piechart": piechartScript,
            "scatterplot": scatterplotScript,
        }

        navigator.clipboard.writeText(outerHTML + scripts[settingsRef.current.charttype]);
    };

    return (
        <>
            <ChartSettingsItem idx={0}>
                <label>Download Diagramm: </label>
                <button
                    type="button"
                    className="btn full"
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
            </ChartSettingsItem>

            <ChartSettingsItem idx={1}>
                <label>Diagramm HTML kopieren: </label>
                <button
                    type="button"
                    className="btn full"
                    title="Kopieren des HTML Elements in die Zwischenablage"
                    onClick={copyChartHtml}
                >
                    HTML Kopieren
                </button>
            </ChartSettingsItem>
        </>
    )
}

export default DownloadSettings