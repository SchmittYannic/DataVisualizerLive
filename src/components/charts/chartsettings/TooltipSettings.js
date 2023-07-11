import { useState, useEffect } from "react";

import { useRenderChartProps } from "../../../hooks";
import { Accordion, NumberInput, MyColorPicker } from "../../ui";
import ChartSettingsItem from "./ChartSettingsItem";
import { renderChart } from "../renderChart";

const TooltipSettings = ({ settingsRef, settings, setSettings}) => {
    const renderChartProps = useRenderChartProps(settingsRef);

    const [tooltipColor, setTooltipColor] = useState(settingsRef.current.tooltip.tooltipTextColor);
    const [tooltipBgColor, setTooltipBgColor] = useState(settingsRef.current.tooltip.tooltipBgColor);

    useEffect(() => {
        const newRef = { ...settingsRef.current };
        newRef.tooltip.tooltipTextColor.r = tooltipColor.r;
        newRef.tooltip.tooltipTextColor.g = tooltipColor.g;
        newRef.tooltip.tooltipTextColor.b = tooltipColor.b;
        newRef.tooltip.tooltipTextColor.a = tooltipColor.a;

        settingsRef.current = newRef;
        renderChart(...renderChartProps);
    }, [tooltipColor, settingsRef, renderChartProps]);

    useEffect(() => {
        const newRef = { ...settingsRef.current };
        newRef.tooltip.tooltipBgColor.r = tooltipBgColor.r;
        newRef.tooltip.tooltipBgColor.g = tooltipBgColor.g;
        newRef.tooltip.tooltipBgColor.b = tooltipBgColor.b;
        newRef.tooltip.tooltipBgColor.a = tooltipBgColor.a;

        settingsRef.current = newRef;
        renderChart(...renderChartProps);
    }, [tooltipBgColor, settingsRef, renderChartProps]);

    return (
        <Accordion head="Tooltip">
            <ChartSettingsItem>
                <NumberInput
                    title="Schriftgröße des Tooltips in Pixel"
                    min={0}
                    max={50}
                    pattern="[0-9]+"
                    defaultValue={settings.tooltip.tooltipFontSize}
                    onChange={(newValue) => {
                        const newRef = { ...settingsRef.current };
                        newRef.tooltip.tooltipFontSize = newValue;

                        settingsRef.current = newRef;
                        setSettings(newRef);

                        renderChart(...renderChartProps);
                    }}
                    label={"Schriftgröße:"}
                />
            </ChartSettingsItem>

            <ChartSettingsItem>
                <MyColorPicker
                    color={tooltipColor}
                    setColor={setTooltipColor}
                    label={"Textfarbe:"}
                />
            </ChartSettingsItem>

            <ChartSettingsItem>
                <MyColorPicker
                    color={tooltipBgColor}
                    setColor={setTooltipBgColor}
                    label={"Hintergrundfarbe:"}
                />
            </ChartSettingsItem>
        </Accordion>
    )
}

export default TooltipSettings