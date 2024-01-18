import { useState, useEffect } from "react";

import { NumberInput, MyColorPicker } from "../../ui";
import ChartSettingsItem from "./ChartSettingsItem";
import { renderChart } from "../renderChart";
import { useRenderChartProps } from "../../../hooks";

const TickSettings = ({ settingsRef, settings, setSettings }) => {
    const renderChartProps = useRenderChartProps(settingsRef);
    const [tickTextColor, setTickTextColor] = useState(settingsRef.current.tick.tickTextColor);
    const [tickLineColor, setTickLineColor] = useState(settingsRef.current.tick.tickLineColor);

    useEffect(() => {
        const newRef = { ...settingsRef.current };
        newRef.tick.tickTextColor.r = tickTextColor.r;
        newRef.tick.tickTextColor.g = tickTextColor.g;
        newRef.tick.tickTextColor.b = tickTextColor.b;
        newRef.tick.tickTextColor.a = tickTextColor.a;

        settingsRef.current = newRef;
        renderChart(...renderChartProps);
    }, [tickTextColor, settingsRef, renderChartProps]);

    useEffect(() => {
        const newRef = { ...settingsRef.current };
        newRef.tick.tickLineColor.r = tickLineColor.r;
        newRef.tick.tickLineColor.g = tickLineColor.g;
        newRef.tick.tickLineColor.b = tickLineColor.b;
        newRef.tick.tickLineColor.a = tickLineColor.a;

        settingsRef.current = newRef;
        renderChart(...renderChartProps);
    }, [tickLineColor, settingsRef, renderChartProps]);

    return (
        <>
            <div className="charts-settings-divider">
                Teilstriche
                <div className="charts-settings-divider-line" aria-hidden="true" />
            </div>

            <ChartSettingsItem>
                <NumberInput
                    title="Schriftgröße der Teilstrichbeschriftung in Pixel"
                    min={0}
                    max={50}
                    pattern="[0-9]+"
                    defaultValue={settings.tick.tickFontSize}
                    onChange={(newValue) => {
                        const newRef = { ...settingsRef.current };
                        newRef.tick.tickFontSize = newValue;

                        settingsRef.current = newRef;
                        setSettings(newRef);

                        renderChart(...renderChartProps);
                    }}
                    label={"Schriftgröße:"}
                />
            </ChartSettingsItem>

            <ChartSettingsItem>
                <MyColorPicker
                    color={tickTextColor}
                    setColor={setTickTextColor}
                    label={"Farbe:"}
                />
            </ChartSettingsItem>

            <div className="charts-settings-divider">
                Gitternetz
                <div className="charts-settings-divider-line" aria-hidden="true" />
            </div>

            <ChartSettingsItem>
                <NumberInput
                    title="Linienbreite des Gitternetzes in Pixel"
                    min={0}
                    max={20}
                    pattern="[0-9]+"
                    defaultValue={settings.tick.tickLineWidth}
                    onChange={(newValue) => {
                        const newRef = { ...settingsRef.current };
                        newRef.tick.tickLineWidth = newValue;

                        settingsRef.current = newRef;
                        setSettings(newRef);

                        renderChart(...renderChartProps);
                    }}
                    label={"Linienbreite:"}
                />
            </ChartSettingsItem>

            <ChartSettingsItem>
                <MyColorPicker
                    color={tickLineColor}
                    setColor={setTickLineColor}
                    label={"Farbe:"}
                />
            </ChartSettingsItem>
        </>
    )
}

export default TickSettings