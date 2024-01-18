import { useState, useEffect } from "react";

import { NumberInput, MyColorPicker, TextArea } from "../../ui";
import ChartSettingsItem from "./ChartSettingsItem";
import { useRenderChartProps } from "../../../hooks";
import { renderChart } from "../renderChart";

const YAxisSettings = ({ settingsRef, settings, setSettings }) => {
    const renderChartProps = useRenderChartProps(settingsRef);

    const selectedChart = settingsRef.current.charttype;

    const [yaxisColor, setYaxisColor] = useState(settingsRef.current.label.yaxisColor);

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
        <>
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
        </>
    )
}

export default YAxisSettings