import { useState, useEffect } from "react";

import { ChartSettingsItem } from ".";
import { useRenderChartProps } from "../../../hooks";
import { Accordion, NumberInput, RangeInput, MyColorPicker, Dropdown } from "../../ui";
import { renderChart } from "../renderChart";
import { colorSchemeOptions } from "../../../constants";

const ElementSettings = ({ settingsRef, settings, setSettings }) => {
    const renderChartProps = useRenderChartProps(settingsRef);
    const selectedChart = settingsRef.current.charttype;

    const [binColor, setBinColor] = useState(settingsRef.current.chartelements.binColor);
    const [lineColor, setLineColor] = useState(settingsRef.current.chartelements.lineColor);
    const [pointColor, setPointColor] = useState(settingsRef.current.chartelements.pointColor);
    const [areaColor, setAreaColor] = useState(settingsRef.current.chartelements.areaColor);

    useEffect(() => {
        const newRef = { ...settingsRef.current };
        newRef.chartelements.binColor.r = binColor.r;
        newRef.chartelements.binColor.g = binColor.g;
        newRef.chartelements.binColor.b = binColor.b;
        newRef.chartelements.binColor.a = binColor.a;

        settingsRef.current = newRef;
        renderChart(...renderChartProps);
    }, [binColor, settingsRef, renderChartProps]);

    useEffect(() => {
        const newRef = { ...settingsRef.current };
        newRef.chartelements.lineColor.r = lineColor.r;
        newRef.chartelements.lineColor.g = lineColor.g;
        newRef.chartelements.lineColor.b = lineColor.b;
        newRef.chartelements.lineColor.a = lineColor.a;

        settingsRef.current = newRef;
        renderChart(...renderChartProps);
    }, [lineColor, settingsRef, renderChartProps]);

    useEffect(() => {
        const newRef = { ...settingsRef.current };
        newRef.chartelements.pointColor.r = pointColor.r;
        newRef.chartelements.pointColor.g = pointColor.g;
        newRef.chartelements.pointColor.b = pointColor.b;
        newRef.chartelements.pointColor.a = pointColor.a;

        settingsRef.current = newRef;
        renderChart(...renderChartProps);
    }, [pointColor, settingsRef, renderChartProps]);

    useEffect(() => {
        const newRef = { ...settingsRef.current };
        newRef.chartelements.areaColor.r = areaColor.r;
        newRef.chartelements.areaColor.g = areaColor.g;
        newRef.chartelements.areaColor.b = areaColor.b;
        newRef.chartelements.areaColor.a = areaColor.a;

        settingsRef.current = newRef;
        renderChart(...renderChartProps);
    }, [areaColor, settingsRef, renderChartProps]);

    return (
        <Accordion head="Elemente">
            {
                (selectedChart === "barchart" 
                || selectedChart === "piechart" 
                || selectedChart === "boxplot" 
                || selectedChart === "scatterplot") &&
                    <ChartSettingsItem>
                        <Dropdown
                            OptionsList={colorSchemeOptions}
                            selectedOption={settings.chartelements.colorscheme}
                            setSelectedOption={(input) => {
                                const newRef = { ...settingsRef.current };
                                newRef.chartelements.colorscheme = input;
        
                                settingsRef.current = newRef;
                                setSettings(newRef);
        
                                renderChart(...renderChartProps);
                            }}
                            label={"Farbschema:"}
                        />
                    </ChartSettingsItem>
            }
            {
                selectedChart === "histogram" && (
                    <>
                        <ChartSettingsItem>
                            <NumberInput
                                title="Einstellen einer ungefähren Klassenanzahl des Histogramms"
                                min={0}
                                max={40}
                                pattern="[0-9]+"
                                defaultValue={settings.chartelements.binNumber}
                                onChange={(newValue) => {
                                    const newRef = { ...settingsRef.current };
                                    newRef.chartelements.binNumber = newValue;

                                    settingsRef.current = newRef;
                                    setSettings(newRef);

                                    renderChart(...renderChartProps);
                                }}
                                label={"Klassenanzahl:"}
                            />
                        </ChartSettingsItem>

                        <ChartSettingsItem>
                            <MyColorPicker
                                color={binColor}
                                setColor={setBinColor}
                                label={"Säulenfarbe:"}
                            />
                        </ChartSettingsItem>
                    </>
                )
            }
            {
                (selectedChart === "linechart" || selectedChart === "areachart") && (
                    <>
                        <ChartSettingsItem>
                            <NumberInput
                                title="Einstellen der Linienbreite im Diagramm"
                                min={0}
                                max={20}
                                pattern="[0-9]+"
                                defaultValue={settings.chartelements.lineWidth}
                                onChange={(newValue) => {
                                    const newRef = { ...settingsRef.current };
                                    newRef.chartelements.lineWidth = newValue;

                                    settingsRef.current = newRef;
                                    setSettings(newRef);

                                    renderChart(...renderChartProps);
                                }}
                                label={"Linienbreite:"}
                            />
                        </ChartSettingsItem>
                        
                        <ChartSettingsItem>
                            <MyColorPicker
                                color={lineColor}
                                setColor={setLineColor}
                                label={"Linienfarbe:"}
                            />
                        </ChartSettingsItem>

                        {
                            selectedChart === "areachart" &&
                            <ChartSettingsItem>
                                <MyColorPicker
                                    color={areaColor}
                                    setColor={setAreaColor}
                                    label={"Flächenfarbe:"}
                                />
                            </ChartSettingsItem>
                        }

                        <ChartSettingsItem>
                            <MyColorPicker
                                color={pointColor}
                                setColor={setPointColor}
                                label={"Punktfarbe:"}
                            />
                        </ChartSettingsItem>
                    </>
                )
            }
            {
                (selectedChart === "scatterplot" || selectedChart === "linechart" || selectedChart === "areachart") && (
                    <ChartSettingsItem>
                        <NumberInput
                            title="Einstellen der Radien der Punkte im Diagramm"
                            min={0}
                            max={20}
                            pattern="[0-9]+"
                            defaultValue={settings.chartelements.circleRadius}
                            onChange={(newValue) => {
                                const newRef = { ...settingsRef.current };
                                newRef.chartelements.circleRadius = newValue;

                                settingsRef.current = newRef;
                                setSettings(newRef);

                                renderChart(...renderChartProps);
                            }}
                            label={"Punktegröße:"}
                        />
                    </ChartSettingsItem>
                )
            }

            {
                (selectedChart === "scatterplot" || selectedChart === "linechart" || selectedChart ==="areachart") && (
                    <ChartSettingsItem>
                        <RangeInput
                            title="Einstellen der Transparenz der Punkte im Diagramm"
                            min={0}
                            max={100}
                            defaultValue={settings.chartelements.circleOpacity * 100}
                            onChange={(newValue) => {
                                const newValueDecimal = newValue / 100;
                                //if(opacityLabel) opacityLabel.current.textContent = newValueDecimal;

                                const newRef = { ...settingsRef.current };
                                newRef.chartelements.circleOpacity = newValueDecimal;

                                settingsRef.current = newRef;
                                setSettings(newRef);

                                renderChart(...renderChartProps);
                            }}
                            label={"Punktetransparenz: "}
                        />
                    </ChartSettingsItem>
                )
            }
        </Accordion>
    )
}

export default ElementSettings