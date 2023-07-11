import { useState, useEffect } from "react";

import { Accordion, NumberInput, MyColorPicker, TextArea } from "../../ui";
import ChartSettingsItem from "./ChartSettingsItem";
import { useRenderChartProps } from "../../../hooks";
import { renderChart } from "../renderChart";

const AxisSettings = ({ settingsRef, settings, setSettings }) => {
    const renderChartProps = useRenderChartProps(settingsRef);

    const selectedChart = settingsRef.current.charttype;

    const [xaxisColor, setXaxisColor] = useState(settingsRef.current.label.xaxisColor);
    const [yaxisColor, setYaxisColor] = useState(settingsRef.current.label.yaxisColor);

    useEffect(() => {
        const newRef = { ...settingsRef.current };
        newRef.label.xaxisColor.r = xaxisColor.r;
        newRef.label.xaxisColor.g = xaxisColor.g;
        newRef.label.xaxisColor.b = xaxisColor.b;
        newRef.label.xaxisColor.a = xaxisColor.a;

        settingsRef.current = newRef;
        renderChart(...renderChartProps);
    }, [xaxisColor, settingsRef, renderChartProps]);

    useEffect(() => {
        const newRef = { ...settingsRef.current };
        newRef.label.yaxisColor.r = yaxisColor.r;
        newRef.label.yaxisColor.g = yaxisColor.g;
        newRef.label.yaxisColor.b = yaxisColor.b;
        newRef.label.yaxisColor.a = yaxisColor.a;

        settingsRef.current = newRef;
        renderChart(...renderChartProps);
    }, [yaxisColor, settingsRef, renderChartProps]);

    return (
        <Accordion head="Achsenbeschriftung">
            {
                selectedChart !== "piechart" &&
                <div className="charts-settings-divider">
                    X-Achse
                    <div className="charts-settings-divider-line" aria-hidden="true" />
                </div>
            }

            <ChartSettingsItem>
                <TextArea 
                    value={settings.label.xaxisText}
                    label={selectedChart !== "piechart" ? "Text:" : "Tooltip 1:"}
                    onChange={(newValue) => {
                        const newRef = { ...settingsRef.current };
                        newRef.label.xaxisText = newValue;

                        settingsRef.current = newRef;
                        setSettings(newRef);

                        renderChart(...renderChartProps);
                    }}
                />
            </ChartSettingsItem>

            {
                selectedChart !== "piechart" &&
                <>
                    <ChartSettingsItem>
                        <NumberInput
                            title="Abstand des X-Achsentitels in Pixel"
                            min={0}
                            max={350}
                            pattern="[0-9]+"
                            defaultValue={settings.label.xaxisDistance}
                            onChange={(newValue) => {
                                const newRef = { ...settingsRef.current };
                                newRef.label.xaxisDistance = newValue;

                                settingsRef.current = newRef;
                                setSettings(newRef);

                                renderChart(...renderChartProps);
                            }}
                            label={"Abstand:"}
                        />
                    </ChartSettingsItem>

                    <ChartSettingsItem>
                        <NumberInput
                            title="Schriftgröße des X-Achsentitels in Pixel"
                            min={0}
                            max={50}
                            pattern="[0-9]+"
                            defaultValue={settings.label.xaxisFontSize}
                            onChange={(newValue) => {
                                const newRef = { ...settingsRef.current };
                                newRef.label.xaxisFontSize = newValue;

                                settingsRef.current = newRef;
                                setSettings(newRef);

                                renderChart(...renderChartProps);
                            }}
                            label={"Schriftgröße:"}
                        />
                    </ChartSettingsItem>

                    <ChartSettingsItem>
                        <MyColorPicker
                            color={xaxisColor}
                            setColor={setXaxisColor}
                            label={"Farbe:"}
                        />
                    </ChartSettingsItem>
                </>
            }

            {
                selectedChart !== "piechart" &&
                <div className="charts-settings-divider">
                    Y-Achse
                    <div className="charts-settings-divider-line" aria-hidden="true" />
                </div>
            }

            <ChartSettingsItem>
                <TextArea 
                    value={settings.label.yaxisText}
                    label={selectedChart !== "piechart" ? "Text:" : "Tooltip 2:"}
                    onChange={(newValue) => {
                        const newRef = { ...settingsRef.current };
                        newRef.label.yaxisText = newValue;

                        settingsRef.current = newRef;
                        setSettings(newRef);

                        renderChart(...renderChartProps);
                    }}
                />
            </ChartSettingsItem>

            {
                selectedChart !== "piechart" &&
                <>
                    <ChartSettingsItem>
                        <NumberInput
                            title="Abstand des Y-Achsentitels in Pixel"
                            min={0}
                            max={350}
                            pattern="[0-9]+"
                            defaultValue={settings.label.yaxisDistance}
                            onChange={(newValue) => {
                                const newRef = { ...settingsRef.current };
                                newRef.label.yaxisDistance = newValue;

                                settingsRef.current = newRef;
                                setSettings(newRef);

                                renderChart(...renderChartProps);
                            }}
                            label={"Abstand:"}
                        />
                    </ChartSettingsItem>

                    <ChartSettingsItem>
                        <NumberInput
                            title="Schriftgröße des Y-Achsentitels in Pixel"
                            min={0}
                            max={50}
                            pattern="[0-9]+"
                            defaultValue={settings.label.yaxisFontSize}
                            onChange={(newValue) => {
                                const newRef = { ...settingsRef.current };
                                newRef.label.yaxisFontSize = newValue;

                                settingsRef.current = newRef;
                                setSettings(newRef);

                                renderChart(...renderChartProps);
                            }}
                            label={"Schriftgröße:"}
                        />
                    </ChartSettingsItem>

                    <ChartSettingsItem>
                        <MyColorPicker
                            color={yaxisColor}
                            setColor={setYaxisColor}
                            label={"Farbe:"}
                        />
                    </ChartSettingsItem>
                </>
            }
        </Accordion>
    )
}

export default AxisSettings