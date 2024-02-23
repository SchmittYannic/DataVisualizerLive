import { useEffect, useRef } from "react";
import { select } from "d3-selection";

import { useData } from "hooks";
import { renderChart } from "features/charts/renderChart";
import { InfoBox } from "components/ui";

const Scatterplot = ({ dimensions, settingsRef }) => {
    const { dataAsJSON, dataAsJSONLength, numColumnsLength } = useData();
    const svgWrapperRef = useRef(null);
    const id = "scatterplot";
    
    useEffect(() => {
        if(dataAsJSONLength > 0 && numColumnsLength > 0 && svgWrapperRef !== null) {
            //sichergehen, dass wrapper div keinen Inhalt hat.
            document.getElementById(id).textContent = "";

            //svg erstellen
            select(svgWrapperRef.current)
                .append('svg')
                    .attr('aria-label', 'scatterplot')
                    .attr('id', `${id}SVG`)
                    .attr('width', dimensions.svgWidth)
                    .attr('height', dimensions.svgHeight);

            renderChart(settingsRef, dataAsJSON);
        }
    }, [dataAsJSONLength, numColumnsLength, dataAsJSON, settingsRef, dimensions]);

    if (dataAsJSONLength > 0 && numColumnsLength > 0) {
        return (
            <div id="chart-wrapper">
                <div id="chart-tt-wrapper"></div>
                <div ref={svgWrapperRef} id={id} />
            </div>
        )
    } else {
        return (
            <InfoBox>
                <p>Für den ausgewählten Diagrammtypen konnten keine passenden Daten im Datensatz gefunden werden.</p>
                <p>Das <span style={{fontWeight:"600"}}>Streudiagramm</span> zeigt den Zusammenhang zwischen zwei stetigen Merkmalen. Es setzt mindestens zwei Zahlenspalte voraus.</p>
                <p>Stellen Sie sicher, dass Sie Zellen von Einheiten wie € bereinigen und leere Zellen aus dem Datensatz entfernen.</p>
            </InfoBox>
        )
    }
};

export default Scatterplot;