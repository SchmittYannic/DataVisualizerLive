import { ChartSettingsItem } from ".";
import { saveSvg } from "../saveSvg";
import { barchartScript } from "../barchart/BarchartLogic";
import { areachartScript } from "../areachart/AreachartLogic";
import { linechartScript } from "../linechart/LinechartLogic";
import { boxplotScript } from "../boxplot/BoxplotLogic";
import { histogramScript } from "../histogram/HistogramLogic";
import { piechartScript } from "../piechart/PiechartLogic";
import { scatterplotScript } from "../scatterplot/ScatterplotLogic";

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