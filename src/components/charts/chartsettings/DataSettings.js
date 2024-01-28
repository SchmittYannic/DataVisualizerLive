import { ChartSettingsItem } from ".";
import { placeholderString } from "../../../constants";
import { useData } from "../../../hooks";
import { Dropdown } from "../../ui";
import { renderChart } from "../renderChart";

const DataSettings = ({ settingsRef, settings, setSettings  }) => {
    const { dataAsJSON, dataCopy, catColumns, numColumns, dateOptions, catOptions } = useData();

    const selectedChart = settingsRef.current.charttype;

    const renderChartProps = (selectedChart === "linechart" || selectedChart === "areachart") ? [settingsRef, dataCopy] : [settingsRef, dataAsJSON];

    const setSettingsAndRender = (newRef) => {
        settingsRef.current = newRef;
        setSettings(newRef);

        renderChart(...renderChartProps);
    };
    
    const handleXCatColumnChange = (input) => {
        const newRef = { ...settingsRef.current };

        newRef.dataInput.xColumn = input;
        if (selectedChart ==="barchart") {
            newRef.label.titleText = `Absolute Häufigkeiten der Kategorien aus ${input}`;
            newRef.label.xaxisText = "Kategorien";
            newRef.label.yaxisText = "Absolute Häufigkeit";
        }
        if (selectedChart ==="piechart") {
            newRef.label.titleText = `Relative Häufigkeiten der Kategorien aus ${input}`;
            newRef.label.xaxisText = "Kategorien";
            newRef.label.yaxisText = "Relative Häufigkeit";
        }

        setSettingsAndRender(newRef);
    };

    const handleXNumColumnChange = (input) => {
        const newRef = { ...settingsRef.current };

        newRef.dataInput.xColumn = input;
        if (selectedChart === "scatterplot" && newRef.dataInput.zGrouping === placeholderString) {
            newRef.label.titleText = `Zusammenhang zwischen ${input} und ${newRef.dataInput.yColumn}`;
            newRef.label.xaxisText = `${input}`;
            newRef.label.yaxisText = `${newRef.dataInput.yColumn}`;
        }
        if (selectedChart === "scatterplot" && newRef.dataInput.zGrouping !== placeholderString) {
            newRef.label.titleText = `Zusammenhang zwischen ${input} und ${newRef.dataInput.yColumn} gruppiert durch ${newRef.dataInput.zGrouping}`;
            newRef.label.xaxisText = `${input}`;
            newRef.label.yaxisText = `${newRef.dataInput.yColumn}`;
        }
        if (selectedChart === "boxplot" && newRef.dataInput.zGrouping === placeholderString) {
            newRef.label.titleText = `Boxplot von ${input}`;
            newRef.label.xaxisText = "";
            newRef.label.yaxisText = `${input}`;
        }
        if (selectedChart === "boxplot" && newRef.dataInput.zGrouping !== placeholderString) {
            newRef.label.titleText = `Boxplot von ${input} gruppiert durch ${newRef.dataInput.zGrouping}`;
            newRef.label.xaxisText = `${newRef.dataInput.zGrouping}`;
            newRef.label.yaxisText = `${input}`;
        }
        if (selectedChart === "histogram") {
            newRef.label.titleText = `Häufigkeitsverteilung von ${input}`;
            newRef.label.xaxisText = "Klassen";
            newRef.label.yaxisText = "absolute Häufigkeit";
        }

        setSettingsAndRender(newRef);
    };

    const handleXDateColumnChange = (input) => {
        const newRef = { ...settingsRef.current };

        newRef.dataInput.xColumn = input;
        if (selectedChart ==="linechart") {
            newRef.label.titleText = `Verlauf von ${settingsRef.current.dataInput.yColumn} anhand von ${input}`;
            newRef.label.xaxisText = `${input}`;
            newRef.label.yaxisText = `${newRef.dataInput.yColumn}`;
        }
        if (selectedChart ==="areachart") {
            newRef.label.titleText = `Verlauf von ${settingsRef.current.dataInput.yColumn} anhand von ${input}`;
            newRef.label.xaxisText = `${input}`;
            newRef.label.yaxisText = `${newRef.dataInput.yColumn}`;
        }

        setSettingsAndRender(newRef);
    };

    const handleYNumColumnsChange = (input) => {
        const newRef = { ...settingsRef.current };

        newRef.dataInput.yColumn = input;
        if (selectedChart === "scatterplot" && newRef.dataInput.zGrouping === placeholderString) {
            newRef.label.titleText = `Zusammenhang zwischen ${newRef.dataInput.xColumn} und ${input}`;
            newRef.label.xaxisText = `${newRef.dataInput.xColumn}`;
            newRef.label.yaxisText = `${input}`;
        }
        if (selectedChart === "scatterplot" && newRef.dataInput.zGrouping !== placeholderString) {
            newRef.label.titleText = `Zusammenhang zwischen ${newRef.dataInput.xColumn} und ${input} gruppiert durch ${newRef.dataInput.zGrouping}`;
            newRef.label.xaxisText = `${newRef.dataInput.xColumn}`;
            newRef.label.yaxisText = `${input}`;
        }
        if (selectedChart ==="linechart") {
            newRef.label.titleText = `Verlauf von ${input} anhand von ${settingsRef.current.dataInput.xColumn}`;
            newRef.label.xaxisText = `${newRef.dataInput.xColumn}`;
            newRef.label.yaxisText = `${input}`;
        }
        if (selectedChart ==="areachart") {
            newRef.label.titleText = `Verlauf von ${input} anhand von ${settingsRef.current.dataInput.xColumn}`;
            newRef.label.xaxisText = `${newRef.dataInput.xColumn}`;
            newRef.label.yaxisText = `${input}`;
        }

        setSettingsAndRender(newRef);
    };

    const handleZCatGroupingChange = (input) => {
        const newRef = { ...settingsRef.current };

        newRef.dataInput.zGrouping = input;
        if (selectedChart === "scatterplot" && newRef.dataInput.zGrouping === placeholderString) {
            newRef.label.titleText = `Zusammenhang zwischen ${newRef.dataInput.xColumn} und ${newRef.dataInput.yColumn}`;
            newRef.label.xaxisText = `${newRef.dataInput.xColumn}`;
            newRef.label.yaxisText = `${newRef.dataInput.yColumn}`;
        }
        if (selectedChart === "scatterplot" && newRef.dataInput.zGrouping !== placeholderString) {
            newRef.label.titleText = `Zusammenhang zwischen ${newRef.dataInput.xColumn} und ${newRef.dataInput.yColumn} gruppiert durch ${input}`;
            newRef.label.xaxisText = `${newRef.dataInput.xColumn}`;
            newRef.label.yaxisText = `${newRef.dataInput.yColumn}`;
        }
        if (selectedChart ==="boxplot" && newRef.dataInput.zGrouping === placeholderString) {
            newRef.label.titleText = `Boxplot von ${newRef.dataInput.xColumn}`;
            newRef.label.xaxisText = "";
            newRef.label.yaxisText = `${newRef.dataInput.xColumn}`;
        }
        if (selectedChart ==="boxplot" && newRef.dataInput.zGrouping !== placeholderString) {
            newRef.label.titleText = `Boxplot von ${newRef.dataInput.xColumn} gruppiert durch ${input}`;
            newRef.label.xaxisText = `${input}`;
            newRef.label.yaxisText = `${newRef.dataInput.xColumn}`;
        }

        setSettingsAndRender(newRef);
    };

    return (
        <>
            {
                (selectedChart === "barchart" || selectedChart === "piechart") && (
                    <ChartSettingsItem idx={0}>
                        <Dropdown
                            OptionsList={catColumns}
                            selectedOption={settings.dataInput.xColumn}
                            setSelectedOption={handleXCatColumnChange}
                            label={"Eingabespalte:" }
                        />
                    </ChartSettingsItem>
                )
            }
            {
                (selectedChart === "scatterplot" || selectedChart === "boxplot" || selectedChart === "histogram") && (
                    <ChartSettingsItem idx={0}>
                        <Dropdown
                            OptionsList={numColumns}
                            selectedOption={settings.dataInput.xColumn}
                            setSelectedOption={handleXNumColumnChange}
                            label={
                                selectedChart === "boxplot" || selectedChart === "histogram"
                                ? "Eingabespalte:" 
                                : "X-Achse:"
                            }
                        />
                    </ChartSettingsItem>
                )
            }
            {
                (selectedChart === "linechart" || selectedChart === "areachart") && (
                    <ChartSettingsItem idx={0}>
                        <Dropdown
                            OptionsList={dateOptions}
                            selectedOption={settings.dataInput.xColumn}
                            setSelectedOption={handleXDateColumnChange}
                            label={"X-Achse:"}
                        />
                    </ChartSettingsItem>
                )
            }
            {
                (selectedChart === "scatterplot" || selectedChart === "linechart" || selectedChart === "areachart") && (
                    <ChartSettingsItem idx={1}>
                        <Dropdown
                            OptionsList={numColumns}
                            selectedOption={settings.dataInput.yColumn}
                            setSelectedOption={handleYNumColumnsChange}
                            label={"Y-Achse:"}
                        />
                    </ChartSettingsItem>
                )
            }
            {
                (selectedChart === "scatterplot" || selectedChart === "boxplot") && (
                    <ChartSettingsItem idx={selectedChart === "scatterplot" ? 2 : 1}>
                        <Dropdown
                            OptionsList={catOptions}
                            selectedOption={settings.dataInput.zGrouping}
                            setSelectedOption={handleZCatGroupingChange}
                            label={"Gruppierung:"}
                        />
                    </ChartSettingsItem>
                )
            }
        </>
    )
}

export default DataSettings