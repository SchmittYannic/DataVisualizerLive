import { select, selectAll } from "d3-selection";
import { nest } from "d3-collection";
import { ascending , min, max, quantile } from "d3-array";

import { barchart } from "./barchart/BarchartLogic";
import { piechart } from "./piechart/PiechartLogic";
import { boxplot } from "./boxplot/BoxplotLogic";
import { histogram } from "./histogram/HistogramLogic";
import { scatterplot } from "./scatterplot/ScatterplotLogic";
import { linechart } from "./linechart/LinechartLogic";
import { areachart } from "./areachart/AreachartLogic";
import { calcKurtosis } from "./boxplot/calcKurtosis";
import { calcSkewness } from "./boxplot/calcSkewness";
import { placeholderString } from "constants";

export const renderChart = (settingsRef, dataAsJSON) => {
    const charttype = settingsRef.current.charttype;
    const { xColumn, zGrouping } = settingsRef.current.dataInput;
    const { svgWidth, svgHeight } = settingsRef.current.dimensions;
    const svg = select(`#${charttype}SVG`);

    switch(charttype) {
        case "barchart":
            renderBarchart();
            break;
        case "piechart":
            renderPiechart();
            break;
        case "boxplot":
            renderBoxplot();
            break;
        case "histogram":
            renderHistogram();
            break;
        case "scatterplot":
            renderScatterplot();
            break;
        case "linechart":
            renderLinechart();
            break;
        case "areachart":
            renderAreachart();
            break;
        default:
            throw Error("unknown charttype in renderChart function");
    }

    function renderBarchart() {
        const abs = calcAbs();
        svg.call(barchart, {
            settingsRef,
            data: abs,
        });
    }

    function renderPiechart() {
        selectAll('.slice').remove();
        selectAll('polyline').remove();
        selectAll('.sliceLabel').remove();

        const abs = calcAbs();
        svg.call(piechart, {settingsRef, data: abs});
    }

    function renderBoxplot() {
        const stats = calcBoxplotStats();
        if (stats[0].key === '[object Object]') stats[0].key = xColumn;
        svg.call(boxplot, {settingsRef, data: stats});
    }

    function renderHistogram() {
        svg.call(histogram, {
            settingsRef,
            data: dataAsJSON,
        });
    }

    function renderScatterplot() {
        svg.call(scatterplot, {
            settingsRef,
            data: dataAsJSON,
            placeholderString,
        });
    }

    function renderLinechart() {
        const SortedData = sortByKey(dataAsJSON, xColumn);
        const pathdata = nest()
            .key(function(d) { return d})  
            .entries(SortedData);

        function sortByKey(array, key) {
            const arrayCopy = JSON.parse(JSON.stringify(array));
            return arrayCopy.sort(function(a, b) {
                var x = a[key]; var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        };

        if (xColumn===undefined) {
            svg.append('text')
                .style('text-anchor', "middle")
                .attr('x', svgWidth/2)
                .attr('y', svgHeight/2)
                .text('Keine Daten für dieses Diagramm in Ihrem Datensatz enthalten');
        } else {
            svg.call(linechart, {
                settingsRef,
                data: SortedData,
                pathdata,
            });
        }
    }

    function renderAreachart() {
        const SortedData = sortByKey(dataAsJSON, xColumn);
        const pathdata = nest()
            .key(function(d) { return d})  
            .entries(SortedData);

        function sortByKey(array, key) {
            const arrayCopy = JSON.parse(JSON.stringify(array));
            return arrayCopy.sort(function(a, b) {
                var x = a[key]; var y = b[key];
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        };

        if (xColumn===undefined) {
            svg.append('text')
                .style('text-anchor', "middle")
                .attr('x', svgWidth/2)
                .attr('y', svgHeight/2)
                .text('Keine Daten für dieses Diagramm in Ihrem Datensatz enthalten');
        } else {
            svg.call(areachart, {
                settingsRef,
                data: SortedData,
                pathdata,
            });
        }
    }

    function calcAbs() {
        const abs = nest().key(d => d[xColumn]).rollup(d => d.length).entries(dataAsJSON);
        return abs.sort( (a, b) => b.value - a.value );
    }

    function calcBoxplotStats() {
        const calcStats = d => {
            const array = d.map(e => e[xColumn]);
            const q1 = quantile(array.sort(ascending),.25);
            const median = quantile(array.sort(ascending),.5);
            const q3 = quantile(array.sort(ascending),.75);
            const iqr = q3 - q1;
            const lowerIqr = q1 - 1.5 * iqr;
            const upperIqr = q3 + 1.5 * iqr;
            const minimun = min(array);
            const maximum = max(array);
            const lowOutlier = array.filter(outlier => outlier < lowerIqr);
            const highOutlier = array.filter(outlier => outlier > upperIqr);
            const skewness = calcSkewness(array);
            const kurtosis = calcKurtosis(array);
            return({
                q1: q1,
                median: median,
                q3: q3,
                iqr: iqr,
                lowerIqr: lowerIqr,
                upperIqr: upperIqr,
                min: minimun,
                max: maximum,
                lowOutlier: lowOutlier,
                highOutlier: highOutlier,
                skewness: skewness,
                kurtosis: kurtosis
            })
        };

        let stats;

        if (zGrouping !== placeholderString){
            stats = nest().key(d => d[zGrouping]).rollup(calcStats).entries(dataAsJSON);
        } else {
            stats = nest().key(d => d).rollup(calcStats).entries(dataAsJSON);
        }

        return stats;
    }
};