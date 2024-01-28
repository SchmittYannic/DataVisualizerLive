import { NumberInput } from "../../ui";
import { ChartSettingsItem } from ".";

const DimensionSettings = ({ settingsRef, setDimensions, settings, setSettings }) => {
    return (
        <>
            <ChartSettingsItem idx={0}>
                <NumberInput
                    title="Einstellen der Breite des gesamten Svgs"
                    min={0}
                    max={1900}
                    pattern="[0-9]+"
                    defaultValue={settings.dimensions.svgWidth}
                    onChange={(newValue) => {
                        const newRef = { ...settingsRef.current };
                        newRef.dimensions.svgWidth = newValue;

                        settingsRef.current = newRef;
                        setSettings(newRef);

                        //re-renders parent and the chartcomponent
                        setDimensions((prev) => {
                            const newState = { ...prev };
                            newState.svgWidth = newValue;
                            return newState
                        });
                    }}
                    label={"Breite Svg:"}
                />
            </ChartSettingsItem>

            <ChartSettingsItem idx={1}>
                <NumberInput
                    title="Einstellen der Höhe des gesamten Svgs"
                    min={0}
                    max={1900}
                    pattern="[0-9]+"
                    defaultValue={settings.dimensions.svgHeight}
                    onChange={(newValue) => {
                        const newRef = { ...settingsRef.current };
                        newRef.dimensions.svgHeight = newValue;

                        settingsRef.current = newRef;
                        setSettings(newRef);

                        //re-renders parent and the chartcomponent
                        setDimensions((prev) => {
                            const newState = { ...prev };
                            newState.svgHeight = newValue;
                            return newState
                        });
                    }}
                    label={"Höhe Svg:"}
                />
            </ChartSettingsItem>

            <ChartSettingsItem idx={2}>
                <NumberInput
                    title="Einstellen der linken Randbreite des Diagramms"
                    min={0}
                    max={400}
                    pattern="[0-9]+"
                    defaultValue={settings.dimensions.svgMarginLeft}
                    onChange={(newValue) => {
                        const newRef = { ...settingsRef.current };
                        newRef.dimensions.svgMarginLeft = newValue;

                        settingsRef.current = newRef;
                        setSettings(newRef);

                        //re-renders parent and the chartcomponent
                        setDimensions((prev) => {
                            const newState = { ...prev };
                            newState.svgMarginLeft = newValue;
                            return newState
                        });
                    }}
                    label={"Rand Links:"}
                />
            </ChartSettingsItem>

            <ChartSettingsItem idx={3}>
                <NumberInput
                    title="Einstellen der rechten Randbreite des Diagramms"
                    min={0}
                    max={400}
                    pattern="[0-9]+"
                    defaultValue={settings.dimensions.svgMarginRight}
                    onChange={(newValue) => {
                        const newRef = { ...settingsRef.current };
                        newRef.dimensions.svgMarginRight = newValue;

                        settingsRef.current = newRef;
                        setSettings(newRef);

                        //re-renders parent and the chartcomponent
                        setDimensions((prev) => {
                            const newState = { ...prev };
                            newState.svgMarginRight = newValue;
                            return newState
                        });
                    }}
                    label={"Rand Rechts:"}
                />
            </ChartSettingsItem>

            <ChartSettingsItem idx={4}>
                <NumberInput
                    title="Einstellen der oberen Randbreite des Diagramms"
                    min={0}
                    max={400}
                    pattern="[0-9]+"
                    defaultValue={settings.dimensions.svgMarginTop}
                    onChange={(newValue) => {
                        const newRef = { ...settingsRef.current };
                        newRef.dimensions.svgMarginTop = newValue;

                        settingsRef.current = newRef;
                        setSettings(newRef);

                        //re-renders parent and the chartcomponent
                        setDimensions((prev) => {
                            const newState = { ...prev };
                            newState.svgMarginTop = newValue;
                            return newState
                        });
                    }}
                    label={"Rand Oben:"}
                />
            </ChartSettingsItem>

            <ChartSettingsItem idx={5}>
                <NumberInput
                    title="Einstellen der unteren Randbreite des Diagramms"
                    min={0}
                    max={400}
                    pattern="[0-9]+"
                    defaultValue={settings.dimensions.svgMarginBottom}
                    onChange={(newValue) => {
                        const newRef = { ...settingsRef.current };
                        newRef.dimensions.svgMarginBottom = newValue;

                        settingsRef.current = newRef;
                        setSettings(newRef);

                        //re-renders parent and the chartcomponent
                        setDimensions((prev) => {
                            const newState = { ...prev };
                            newState.svgMarginBottom = newValue;
                            return newState
                        });
                    }}
                    label={"Rand Unten:"}
                />
            </ChartSettingsItem>
        </>
    )
}

export default DimensionSettings