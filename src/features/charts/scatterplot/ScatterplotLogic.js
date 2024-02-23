import * as d3 from "d3";
import { colorlegend } from "./Colorlegend";

export const scatterplot = (selection, props) => {
    const { settingsRef, data, placeholderString } = props;

    const { xColumn, yColumn, zGrouping } = settingsRef.current.dataInput;

    const { 
        svgWidth,
        svgHeight,
        svgMarginLeft,
        svgMarginTop,
        svgMarginRight,
        svgMarginBottom,
    } = settingsRef.current.dimensions;

    const {
        fontFamily,
        svgBg,
    } = settingsRef.current.general;

    const {
        titleText,
        titleDistance,
        titleFontSize,
        titleColor,
        xaxisText,
        xaxisDistance,
        xaxisFontSize,
        xaxisColor,
        yaxisText,
        yaxisDistance,
        yaxisFontSize,
        yaxisColor,
    } = settingsRef.current.label;

    const {
        colorscheme,
        circleOpacity,
        circleRadius
    } = settingsRef.current.chartelements;

    const {
        tickFontSize,
        tickTextColor,
        tickLineWidth,
        tickLineColor,
    } = settingsRef.current.tick;

    const {
        tooltipFontSize,
        tooltipTextColor,
        tooltipBgColor,
    } = settingsRef.current.tooltip;

    const colorDict = {
        "accent": d3.schemeAccent,
        "category10": d3.schemeCategory10,
        "dark2": d3.schemeDark2,
        "paired": d3.schemePaired,
        "pastel1": d3.schemePastel1,
        "pastel2": d3.schemePastel2,
        "set1": d3.schemeSet1,
        "set2": d3.schemeSet2,
        "set3": d3.schemeSet3,
        "tableau10": d3.schemeTableau10,
    }

    const xValue = d => d[xColumn];
    const yValue = d => d[yColumn];
    const colorValue = d => d[zGrouping];
  
    ////////////////////////////////////////////////////////////////
    ///////////////////////////Tooltip//////////////////////////////
    ////////////////////////////////////////////////////////////////
    //select tooltipWrapper element on page
    const tooltipWrapper = d3.select('#chart-tt-wrapper')

    //make sure it is empty
    tooltipWrapper.html("")
  
    //create a tooltip text inside the wrapper
    let tooltip = tooltipWrapper.append('text')
        .attr('class', 'chart-tt')
        .attr("data-font-family", fontFamily)
        .attr("data-font-size", tooltipFontSize + "px")
        .attr("data-line-height", tooltipFontSize * 1.15 + "px")
        .attr("data-max-width", 12 * tooltipFontSize + "px")
        .attr("data-padding", 0.6 * titleFontSize + "px")
        .attr("data-background-color", `rgba(${tooltipBgColor.r}, ${tooltipBgColor.g}, ${tooltipBgColor.b}, ${tooltipBgColor.a})`)
        .attr("data-text-color", `rgba(${tooltipTextColor.r}, ${tooltipTextColor.g}, ${tooltipTextColor.b}, ${tooltipTextColor.a})`)
        .style("visibility", "hidden")
        .style('display', 'inline')
        .style("position", "absolute")
        .style("text-align", "left")
        .style("font-family", fontFamily)
        .style("font-size", tooltipFontSize + "px")
        .style("line-height", tooltipFontSize * 1.15 + "px")
        .style("max-width", 12 * tooltipFontSize + "px")
        .style("max-height", "800px")
        .style("padding", 0.6 * titleFontSize + "px")
        .style("background-color", `rgba(${tooltipBgColor.r}, ${tooltipBgColor.g}, ${tooltipBgColor.b}, ${tooltipBgColor.a})`)
        .style("color", `rgba(${tooltipTextColor.r}, ${tooltipTextColor.g}, ${tooltipTextColor.b}, ${tooltipTextColor.a})`)
        .style("border-radius", "8px")
        .style("pointer-events", "none")
        .style("transform", "translate(-100%, -100%)");

    function mouseover(){
        tooltip.style('visibility', 'visible');
    }
    function mousemove(){
        let d = d3.select(this).data()[0]
    
        if (zGrouping === placeholderString) {
            tooltip
                .html(yaxisText + ': ' + d[yColumn] + '</br></br>' + xaxisText + ': ' + d[xColumn])
                .style('left', (d3.event.pageX) + 'px')
                .style('top', (d3.event.pageY) + 'px');
        } else {
            tooltip
                .html(yaxisText + ': ' + d[yColumn] + '</br></br>' + xaxisText + ': ' + d[xColumn] + '</br></br>' + zGrouping + ': ' + d[zGrouping])
                .style('left', (d3.event.pageX) + 'px')
                .style('top', (d3.event.pageY) + 'px');
        }
    }
    function mouseout(){
        tooltip.style('visibility', 'hidden');
    }
  
    ////////////////////////////////////////////////////////////////
    /////////////////////////Kern-elemente//////////////////////////
    ////////////////////////////////////////////////////////////////
    //Breite und Höhe der Zeichenfläche
    const innerWidth = svgWidth - svgMarginLeft - svgMarginRight;
    const innerHeight = svgHeight - svgMarginTop - svgMarginBottom;
    //x, y und colorScale
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
        .nice();
  
    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, yValue))
            .range([innerHeight, 0])
        .nice();
  
    const colorScale = d3.scaleOrdinal(colorDict[`${colorscheme}`]);

    const background = selection.selectAll('.backgroundScatterPlot').data([null]);
    background.enter().append('rect')
            .attr('class', 'backgroundScatterPlot')
        .merge(background)
            .attr("height", svgHeight)
            .attr("width", svgWidth)
            .attr("fill", `rgba(${svgBg.r}, ${svgBg.g}, ${svgBg.b}, ${svgBg.a})`);
    //container erstellen, der alle Elemente des SVG am Schluss enthält
    const g = selection.selectAll('.containScatterPlot').data([null]);
    const gEnter = g.enter().append('g')
        .attr('class', 'containScatterPlot');
  
    gEnter
        .merge(g)
            .attr('transform',
                `translate(${svgMarginLeft},${svgMarginTop})`
            );
    //custom Format für Achsen
    const formatLarge = number =>
        d3.format('~s')(number)
            .replace('G', ' Mrd.')
            .replace('M', ' Mio.')
            .replace('k', ' Tsd.');
  
    const formatSmall = d3.format('~f');

    let customFormat = function(val) { 
        return Math.abs(val) < 1 ? formatSmall(val) : formatLarge(val);
    };
    //Erstellung und Hinzufügen der Achsen und Achsenbeschreibung
    const xAxis = d3.axisBottom(xScale)
        .tickFormat(customFormat)
        .tickSize(-innerHeight)
        .tickPadding(20);
  
 	const yAxis = d3.axisLeft(yScale)
        .tickFormat(customFormat)
        .tickSize(-innerWidth)
        .tickPadding(10);
  
    const yAxisG = g.select('.y-axis');
    const yAxisGEnter = gEnter
        .append('g')
            .attr('class', 'y-axis')

    yAxisG
        .merge(yAxisGEnter)
            .transition().duration(1000)
            .call(yAxis);
    yAxisG
        .merge(yAxisGEnter)
        .selectAll('.tick line')
            .attr("stroke", `rgba(${tickLineColor.r}, ${tickLineColor.g}, ${tickLineColor.b}, ${tickLineColor.a})`)
            .attr("stroke-width", tickLineWidth);
    yAxisG
        .merge(yAxisGEnter)
        .selectAll('.tick text')
        .attr("fill", `rgba(${tickTextColor.r}, ${tickTextColor.g}, ${tickTextColor.b}, ${tickTextColor.a})`)
            .attr("font-size", tickFontSize)
            .attr("font-family", fontFamily);
  
    yAxisG
        .merge(yAxisGEnter)
        .selectAll('.domain').remove();
    //yAxisLabelText
    yAxisGEnter
        .append('text')
            .attr('class', 'axis-label')
            .attr('transform', `rotate(-90)`)
            .style('text-anchor', 'middle')
        .merge(yAxisG.select('.axis-label'))
            .attr('y', -yaxisDistance)
            .attr('x', -innerHeight/2)
            .text(yaxisText)
            .attr("fill", `rgba(${yaxisColor.r}, ${yaxisColor.g}, ${yaxisColor.b}, ${yaxisColor.a})`)
            .attr("font-size", yaxisFontSize)
            .attr("font-family", fontFamily);
  
  
    const xAxisG = g.select('.x-axis');
    const xAxisGEnter = gEnter
        .append('g')
            .attr('class', 'x-axis')
    xAxisG
        .merge(xAxisGEnter)
            .attr('transform', `translate(0, ${innerHeight})`)
            .transition().duration(1000)
            .call(xAxis)
    xAxisG
        .merge(xAxisGEnter)
        .selectAll('.tick line')
            .attr("stroke", `rgba(${tickLineColor.r}, ${tickLineColor.g}, ${tickLineColor.b}, ${tickLineColor.a})`)
            .attr("stroke-width", tickLineWidth);
    // rotieren der tick label
    xAxisG
        .merge(xAxisGEnter)
        .selectAll('.tick text')
            .style('text-anchor', 'end')
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-30)" 
            })
            .attr("fill", `rgba(${tickTextColor.r}, ${tickTextColor.g}, ${tickTextColor.b}, ${tickTextColor.a})`)
            .attr("font-size", tickFontSize)
            .attr("font-family", fontFamily);
  
    xAxisG
        .merge(xAxisGEnter)
        .selectAll('.domain').remove();
    //xAxisLabelText
    xAxisGEnter
        .append('text')
            .attr('class', 'axis-label')
        .merge(xAxisG.select('.axis-label'))
            .attr('y', xaxisDistance)
            .attr('x', innerWidth / 2)
            .text(xaxisText)
            .attr("fill", `rgba(${xaxisColor.r}, ${xaxisColor.g}, ${xaxisColor.b}, ${xaxisColor.a})`)
            .attr("font-size", xaxisFontSize)
            .attr("font-family", fontFamily);
  
    //Erstellung und Hinzufügen eines Titels
    const titleG = g.select('.titleChart');
    const titleGEnter = gEnter
        .append('g')
        .attr('class', 'titleChart');
    
    //titleText
    titleGEnter
        .append('text')
            .attr('class', 'titleChart')
            .attr('text-anchor', 'middle')
        .merge(titleG.select('.titleChart'))
            .attr('x', innerWidth / 2)
            .attr('y', titleDistance - svgMarginTop)
            .text(titleText)
            .attr("fill", `rgba(${titleColor.r}, ${titleColor.g}, ${titleColor.b}, ${titleColor.a})`)
            .attr("font-size", titleFontSize)
            .attr("font-family", fontFamily);

    // const subTitleG = g.select('.subTitleChart');
    // const subTitleGEnter = gEnter
    //     .append('g')
    //     .attr('class', 'subTitleChart');

    // let subTitleString = ''

    // if(zGrouping !== placeholderString){
    //     subTitleString += 'gruppiert durch ' + zGrouping;
    // }
    // //subTitleText  
    // subTitleGEnter
    //     .append('text')
    //         .attr('class', 'subTitleChart')
    //         .attr('text-anchor', 'middle')
    //     .merge(subTitleG.select('.subTitleChart'))
    //         .attr('x', innerWidth / 2)
    //         .attr('y', (titleDistance - svgMarginTop) + titleFontSize + 12) //-svgMarginTop / 4
    //         .text("")
    //         .attr("fill", `rgba(${titleColor.r}, ${titleColor.g}, ${titleColor.b}, ${titleColor.a})`)
    //         .attr("font-size", titleFontSize)
    //         .attr("font-family", titleFont);
  
    ////////////////////////////////////////////////////////////////
    /////////////////////////Diagramm-elemente//////////////////////
    ////////////////////////////////////////////////////////////////
    //Erstellung von Container für Brush und Kreise
    const gCircle = g.merge(gEnter).selectAll('.containCircles').data([null]);
    const gCircleEnter = gCircle.enter().append('g')
        .attr('class', 'containCircles')
        .attr('clip-path', 'url(#clip)');
      
    gCircleEnter.merge(gCircle)
    //Hinzufügen der Kreise auf Zeichenfläche
    const circles = gCircle.merge(gCircleEnter).selectAll('.circleScatterplot').data(data);
    circles.enter().append('circle')
        .attr('class', 'circleScatterplot')
        .attr('cx', innerWidth / 2)
        .attr('cy', innerHeight / 2)
        .attr('r', 0)
  	.merge(circles)
  	.on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout)
  	.transition().duration(1000)
  	//.delay((d, i) => i * 5)
  		.attr('fill', d => colorScale(colorValue(d)))
  		.attr('cy', d => yScale(yValue(d)))
		.attr('cx', d => xScale(xValue(d)))
        .attr("data-x", d => d[xColumn])
        .attr("data-y", d => d[yColumn])
        .attr("data-z", d => d[zGrouping])
  		.attr('r', circleRadius)
        .attr('opacity', circleOpacity)
    circles.exit().remove()
    //Hinzufügen der Legende
    if (zGrouping !== placeholderString){
        //Hinzufügen der Legende, wenn Gruppierung gewählt
        const svg = d3.select('#scatterplot svg');
        svg.call(colorlegend, {
            colorScale: colorScale,
            positionX: innerWidth + svgMarginLeft + svgMarginRight / 4,
            positionY: innerHeight / 2,
            tickRadius: 12,
            tickSpacing: 35,
            tickPadding: 6,
            label: zGrouping,
            labelX: -20,
            labelY: -30,
            labelFont: fontFamily,
        });
    } else {
        //löschen der Legend, wenn keine Gruppierung ausgewählt wurde
        d3.selectAll('.legendScatterPlot').remove()
    }
    ////////////////////////////////////////////////////////////////
    /////////////////////////Zoom Funktionalität////////////////////
    ////////////////////////////////////////////////////////////////
    //https://bl.ocks.org/EfratVil/d956f19f2e56a05c31fb6583beccfda7
//     let brush = d3.brush().extent([[0, 0], [innerWidth, innerHeight]]).on("end", brushended),
//         idleTimeout,
//         idleDelay = 350;

//     const clip = g.selectAll('#clip').data([null])
//     const clipEnter = clip
//         .enter().append("defs").append("svg:clipPath")
//             .attr("id", "clip")
//         .append("svg:rect")
//             .attr("width", innerWidth )
//             .attr("height", innerHeight )
//             .attr("x", 0) 
//             .attr("y", 0);
    
//     clipEnter.merge(clip)
//         .attr("width", innerWidth )
//         .attr("height", innerHeight )
//         .attr("x", 0) 
//         .attr("y", 0);
    
//     d3.selectAll('.containScatterPlot defs').remove(); //Bugfix

//     gCircleEnter.append("g")
//         .attr("class", "brush")
//         .call(brush);

//     d3.selectAll('.circleScatterplot').raise();

//     function brushended() {
//         let s = d3.event.selection;
//         if (!s) {
//             if (!idleTimeout) return idleTimeout = setTimeout(idled, idleDelay);
//             xScale.domain(d3.extent(data, function (d) { return xValue(d); })).nice();
//             yScale.domain(d3.extent(data, function (d) { return yValue(d); })).nice();
//         } else {
//             xScale.domain([s[0][0], s[1][0]].map(xScale.invert, xValue));
//             yScale.domain([s[1][1], s[0][1]].map(yScale.invert, yValue));
//             gCircleEnter.select(".brush").call(brush.move, null);
//         }
//         zoom();
//     }

//     function idled() {
//         idleTimeout = null;
//     }

//     function zoom() {
//         let t = gCircleEnter.transition().duration(1000);
//         selection.select('.x-axis').transition(t).call(xAxis)
//             .selectAll('.tick text')
//                 .style('text-anchor', 'end')
//                 .attr("dx", "-.8em")
//                 .attr("dy", ".15em")
//                 .attr("transform", function(d) {
//                     return "rotate(-30)" 
//                 })
//                 .attr("fill", tickTextColor)
//                 .attr("font-size", tickTextFontSize);
//         selection.select('.y-axis').transition(t).call(yAxis)
//             .selectAll('.tick text')
//                 .attr("fill", tickTextColor)
//                 .attr("font-size", tickTextFontSize);

//         gCircleEnter.selectAll('.circleScatterplot').transition(t)
//             .attr("cx", d => {return xScale(xValue(d)) > innerWidth || xScale(xValue(d)) < 0 ? -1000 : xScale(xValue(d))})
//             .attr("cy", d => {return yScale(yValue(d)) > innerHeight || yScale(yValue(d)) < 0 ? -1000 : yScale(yValue(d))});
//     }
};

export const scatterplotScript = '<script>const tooltipWrapper = document.getElementById("chart-tt-wrapper");const tooltip = tooltipWrapper.getElementsByClassName("chart-tt")[0];const svg = document.getElementById("scatterplotSVG");const axislabels = svg.querySelectorAll(".axis-label");const circles = svg.querySelectorAll(".circleScatterplot");const zGrouping = svg.querySelectorAll(".legendScatterPlot__label")[0].textContent;const tooltipFontFamily = tooltip.getAttribute("data-font-family");const tooltipFontSize = tooltip.getAttribute("data-font-size");const tooltipLineHeight = tooltip.getAttribute("data-line-height");const tooltipMaxWidth = tooltip.getAttribute("data-max-width");const tooltipPadding = tooltip.getAttribute("data-padding");const tooltipBgColor = tooltip.getAttribute("data-background-color");const tooltipTextColor = tooltip.getAttribute("data-text-color");const normalStyle = `visibility: hidden; display: inline; position: absolute; text-align: left; max-width: ${tooltipMaxWidth}; max-height: 800px; padding: ${tooltipPadding}; border-radius: 8px; font-size: ${tooltipFontSize}; font-family: ${tooltipFontFamily}; line-height: ${tooltipLineHeight}; background-color: ${tooltipBgColor}; color: ${tooltipTextColor}; pointer-events: none; transform: translate(-100%, -100%);`;const hoverStyle = `visibility: visible; display: inline; position: absolute; text-align: left; max-width: ${tooltipMaxWidth}; max-height: 800px; padding: ${tooltipPadding}; border-radius: 8px; font-size: ${tooltipFontSize}; font-family: ${tooltipFontFamily}; line-height: ${tooltipLineHeight}; background-color: ${tooltipBgColor}; color: ${tooltipTextColor}; pointer-events: none; transform: translate(-100%, -100%);`;function mouseover(){tooltip.setAttribute("style", hoverStyle);};function mousemove(event, circleXdata, circleYdata, circleZdata){mousePos = { x: event.clientX, y: event.clientY };tooltip.setAttribute("style", hoverStyle + `left: ${mousePos.x}px; top: ${mousePos.y}px`);if (circleZdata !== null) {tooltip.innerHTML = `${axislabels[1].textContent}: ${circleYdata}<br><br>${axislabels[0].textContent}: ${circleXdata}</br></br>${zGrouping}: ${circleZdata}`;} else {tooltip.innerHTML = `${axislabels[1].textContent}: ${circleYdata}<br><br>${axislabels[0].textContent}: ${circleXdata}`;}};function mouseout(){tooltip.setAttribute("style", normalStyle);};circles.forEach((circle) => {const circleXdata = circle.getAttribute("data-x");const circleYdata = circle.getAttribute("data-y");const circleZdata = circle.getAttribute("data-z");circle.addEventListener("mouseover", mouseover);circle.addEventListener("mousemove", (event) => mousemove(event, circleXdata, circleYdata, circleZdata));circle.addEventListener("mouseout", mouseout);});</script>'