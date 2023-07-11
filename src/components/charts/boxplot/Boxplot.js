import { useEffect, useRef } from "react";
import * as d3 from "d3";

import { useData } from "../../../hooks";
import { renderChart } from "../renderChart";
import { InfoBox } from "../../ui";

const Boxplot = ({ dimensions, settingsRef }) => {
    const { dataAsJSON, dataAsJSONLength, numColumnsLength } = useData();
    const svgWrapperRef = useRef(null);
    const id = "boxplot"; 

    useEffect(() => {
        if (dataAsJSONLength > 0 && numColumnsLength > 0) {
            //sichergehen, dass wrapper div keinen Inhalt hat.
            document.getElementById(id).textContent = "";

            //svg erstellen
            d3.select(svgWrapperRef.current)
                .append('svg')
                    .attr('id', `${id}SVG`)
                    .attr('width', dimensions.svgWidth)
                    .attr('height', dimensions.svgHeight);

            renderChart(settingsRef, dataAsJSON);
        }    
    }, [dataAsJSONLength, numColumnsLength, dataAsJSON, settingsRef, dimensions]);

    if (dataAsJSONLength > 0 && numColumnsLength > 0) {
        return (
            <div>
                <div id="chart-tt-wrapper"></div>
                <div ref={svgWrapperRef} id={id} />
            </div>
        )
    } else {
        return (
            <InfoBox>
                <p>Für den ausgewählten Diagrammtypen konnten keine passenden Daten im Datensatz gefunden werden.</p>
                <p>Der <span style={{fontWeight:"600"}}>Boxplot</span> zeigt die Verteilung von mindestens ordinalskalierten Daten. Er setzt mindestens eine Zahlenspalte voraus.</p>
                <p>Stellen Sie sicher, dass Sie Zellen von Einheiten wie € bereinigen und leere Zellen aus dem Datensatz entfernen.</p>
            </InfoBox>
        )
    }
};

export default Boxplot;