import { useState, useEffect } from "react";

import { NumberInput, TextArea, MyColorPicker } from "components/ui";
import ChartSettingsItem from "./ChartSettingsItem";
import { renderChart } from "features/charts/renderChart";
import { useRenderChartProps } from "hooks";

const TitelSettings = ({ settingsRef, settings, setSettings }) => {
    const renderChartProps = useRenderChartProps(settingsRef);
    const [titleColor, setTitleColor] = useState(settingsRef.current.label.titleColor);

    useEffect(() => {
        const newRef = { ...settingsRef.current };
        newRef.label.titleColor.r = titleColor.r;
        newRef.label.titleColor.g = titleColor.g;
        newRef.label.titleColor.b = titleColor.b;
        newRef.label.titleColor.a = titleColor.a;

        settingsRef.current = newRef;
        renderChart(...renderChartProps);
    }, [titleColor, settingsRef, renderChartProps]);

    return (
        <>
             <ChartSettingsItem idx={0}>
                <TextArea 
                    value={settings.label.titleText}
                    label={"Text:"}
                    onChange={(newValue) => {
                        const newRef = { ...settingsRef.current };
                        newRef.label.titleText = newValue;

                        settingsRef.current = newRef;
                        setSettings(newRef);

                        renderChart(...renderChartProps);
                    }}
                />
            </ChartSettingsItem>

            <ChartSettingsItem idx={1}>
                <NumberInput
                    title="Abstand des Titels in Pixel"
                    min={0}
                    max={350}
                    pattern="[0-9]+"
                    defaultValue={settings.label.titleDistance}
                    onChange={(newValue) => {
                        const newRef = { ...settingsRef.current };
                        newRef.label.titleDistance = newValue;

                        settingsRef.current = newRef;
                        setSettings(newRef);

                        renderChart(...renderChartProps);
                    }}
                    label={"Abstand:"}
                />
            </ChartSettingsItem>

            <ChartSettingsItem idx={2}>
                <NumberInput
                    title="Schriftgröße des Titels in Pixel"
                    min={0}
                    max={50}
                    pattern="[0-9]+"
                    defaultValue={settings.label.titleFontSize}
                    onChange={(newValue) => {
                        const newRef = { ...settingsRef.current };
                        newRef.label.titleFontSize = newValue;

                        settingsRef.current = newRef;
                        setSettings(newRef);

                        renderChart(...renderChartProps);
                    }}
                    label={"Schriftgröße:"}
                />
            </ChartSettingsItem>

            <ChartSettingsItem idx={3}>
                <MyColorPicker
                    color={titleColor}
                    setColor={setTitleColor}
                    label={"Farbe:"}
                />
            </ChartSettingsItem>
        </>
    )
}

export default TitelSettings