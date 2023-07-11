import { useState, useEffect } from "react";

import { Accordion, Dropdown, MyColorPicker } from "../../ui";
import { renderChart } from "../renderChart";
import { useFontContext, useRenderChartProps } from "../../../hooks";
import ChartSettingsItem from "./ChartSettingsItem";

const GeneralSettings = ({ settingsRef, settings, setSettings}) => {
    const { availableFonts } = useFontContext();
    const renderChartProps = useRenderChartProps(settingsRef);

    const [svgBgColor, setSvgBgColor] = useState(settingsRef.current.general.svgBg);

    useEffect(() => {
        const newRef = { ...settingsRef.current };
        newRef.general.svgBg.r = svgBgColor.r;
        newRef.general.svgBg.g = svgBgColor.g;
        newRef.general.svgBg.b = svgBgColor.b;
        newRef.general.svgBg.a = svgBgColor.a;

        settingsRef.current = newRef;
        renderChart(...renderChartProps);
    }, [svgBgColor, settingsRef, renderChartProps]);

    return (
        <Accordion head="Allgemein">
            <ChartSettingsItem>
                <Dropdown
                    OptionsList={availableFonts}
                    selectedOption={settings.general.fontFamily}
                    setSelectedOption={(input) => {
                        const newRef = { ...settingsRef.current };
                        newRef.general.fontFamily = input;

                        settingsRef.current = newRef;
                        setSettings(newRef);

                        renderChart(...renderChartProps);
                    }}
                    searchable={true}
                    label={"Schriftart:"}
                />
            </ChartSettingsItem>

            <ChartSettingsItem>
                <MyColorPicker
                    color={svgBgColor}
                    setColor={setSvgBgColor}
                    label={"Hintergrundfarbe:"}
                />
            </ChartSettingsItem>
        </Accordion>
    )
}

export default GeneralSettings