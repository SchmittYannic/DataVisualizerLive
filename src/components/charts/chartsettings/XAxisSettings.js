import { useState, useEffect } from "react";

import { NumberInput, MyColorPicker, TextArea } from "../../ui";
import ChartSettingsItem from "./ChartSettingsItem";
import { useRenderChartProps } from "../../../hooks";
import { renderChart } from "../renderChart";

const XAxisSettings = ({ settingsRef, settings, setSettings }) => {
    const renderChartProps = useRenderChartProps(settingsRef);

    const selectedChart = settingsRef.current.charttype;

    const [xaxisColor, setXaxisColor] = useState(settingsRef.current.label.xaxisColor);

    useEffect(() => {
        const newRef = { ...settingsRef.current };
        newRef.label.xaxisColor.r = xaxisColor.r;
        newRef.label.xaxisColor.g = xaxisColor.g;
        newRef.label.xaxisColor.b = xaxisColor.b;
        newRef.label.xaxisColor.a = xaxisColor.a;

        settingsRef.current = newRef;
        renderChart(...renderChartProps);
    }, [xaxisColor, settingsRef, renderChartProps]);

    return (
        <>
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
        </>
    )
}

export default XAxisSettings