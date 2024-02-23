import * as d3 from "d3";

export const histogram = (selection, props) => {
    const { settingsRef, data } = props;

    const { xColumn } = settingsRef.current.dataInput;

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

    const { binNumber, binColor } = settingsRef.current.chartelements;

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

    const xValue = d => d[xColumn];

    //select tooltipWrapper element on page
    const tooltipWrapper = d3.select("#chart-tt-wrapper");

    //make sure it is empty
    tooltipWrapper.html("");
  
    //create a tooltip text inside the wrapper
    let tooltip = tooltipWrapper.append("text")
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
        d3.selectAll('.histBar').attr('opacity', '0.7');
        d3.select(this).attr('opacity', '1');
    };
    function mousemove(){
        var d = d3.select(this).data()[0];

        tooltip
            .html(xaxisText + ': ' + d.x0 + ' - ' + d.x1 + '</br></br>'
                    +	yaxisText + ': ' + d.length)
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY) + 'px');
    };
    function mouseout(){
        tooltip.style('visibility', 'hidden');
        d3.selectAll('.histBar').attr('opacity', '1');
    };

    const innerWidth = svgWidth - svgMarginLeft - svgMarginRight;
    const innerHeight = svgHeight - svgMarginTop - svgMarginBottom;

    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, xValue))	
        .range([0, innerWidth])
        .nice();

    let histogram = d3.histogram()
        .value(xValue)
        .domain(xScale.domain())
        .thresholds(xScale.ticks(binNumber));

    let bins = histogram(data);

    const yScale = d3.scaleLinear()
        .range([innerHeight, 0])
        .domain([0, d3.max(bins, d => d.length)]);

    const background = selection.selectAll('.backgroundHistogramChart').data([null]);
    background.enter().append('rect')
            .attr('class', 'backgroundHistogramChart')
        .merge(background)
            .attr("height", svgHeight)
            .attr("width", svgWidth)
            .attr("fill", `rgba(${svgBg.r}, ${svgBg.g}, ${svgBg.b}, ${svgBg.a})`);

    const g = selection.selectAll('.containHistogramChart').data([null]);
    const gEnter = g.enter().append('g')
        .attr('class', 'containHistogramChart');
        

    gEnter
        .merge(g)
            .attr('transform',
                `translate(${svgMarginLeft},${svgMarginTop})`
                );

    const formatLarge = number =>
        d3.format('~s')(number)
            .replace('G', ' Mrd.')
            .replace('M', ' Mio.')
            .replace('k', ' Tsd.');

    const formatSmall = d3.format('~f');

    var customFormat = function(val) { 
        return Math.abs(val) < 1 ? formatSmall(val) : formatLarge(val);
    };

    const xAxis = d3.axisBottom(xScale)
        .tickFormat(customFormat)	
        .tickPadding(20)
        .ticks(binNumber);

    const yAxis = d3.axisLeft(yScale)
        .tickFormat(customFormat)
        .tickSize(-innerWidth)
        .tickPadding(10);


    const yAxisG = g.select('.y-axis');
    const yAxisGEnter = gEnter
        .append('g')
            .attr('class', 'y-axis');
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
            .attr('class', 'x-axis');

    xAxisG
        .merge(xAxisGEnter)
            .attr('transform', `translate(0, ${innerHeight})`)
            .transition().duration(500)
            .call(xAxis);
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


    const histBars = g.merge(gEnter).selectAll('rect').data(bins);
    histBars.enter().append('rect')
        .merge(histBars)
            .attr('class', 'histBar')
            .attr('opacity', 0)
            .attr("fill", `rgba(${binColor.r}, ${binColor.g}, ${binColor.b}, ${binColor.a})`)
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout)
            .attr("x", d => xScale(d.x0) + 5)
            .attr("y", d => yScale(d.length))
            .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 10))
            .attr("height", d => yScale(0) - yScale(d.length))
            .attr("data-x0", d => d.x0)
            .attr("data-x1", d => d.x1)
            .attr("data-y", d => d.length)
            .transition().duration(1000)
            .attr('opacity', 1);
    histBars.exit().remove();
};

export const histogramScript = '<script>const tooltipWrapper = document.getElementById("chart-tt-wrapper");const tooltip = tooltipWrapper.getElementsByClassName("chart-tt")[0];const svg = document.getElementById("histogramSVG");const axislabels = svg.querySelectorAll(".axis-label");const bars = svg.querySelectorAll(".histBar");const tooltipFontFamily = tooltip.getAttribute("data-font-family");const tooltipFontSize = tooltip.getAttribute("data-font-size");const tooltipLineHeight = tooltip.getAttribute("data-line-height");const tooltipMaxWidth = tooltip.getAttribute("data-max-width");const tooltipPadding = tooltip.getAttribute("data-padding");const tooltipBgColor = tooltip.getAttribute("data-background-color");const tooltipTextColor = tooltip.getAttribute("data-text-color");const normalStyle = `visibility: hidden; display: inline; position: absolute; text-align: left; max-width: ${tooltipMaxWidth}; max-height: 800px; padding: ${tooltipPadding}; border-radius: 8px; font-size: ${tooltipFontSize}; font-family: ${tooltipFontFamily}; line-height: ${tooltipLineHeight}; background-color: ${tooltipBgColor}; color: ${tooltipTextColor}; pointer-events: none; transform: translate(-100%, -100%);`;const hoverStyle = `visibility: visible; display: inline; position: absolute; text-align: left; max-width: ${tooltipMaxWidth}; max-height: 800px; padding: ${tooltipPadding}; border-radius: 8px; font-size: ${tooltipFontSize}; font-family: ${tooltipFontFamily}; line-height: ${tooltipLineHeight}; background-color: ${tooltipBgColor}; color: ${tooltipTextColor}; pointer-events: none; transform: translate(-100%, -100%);`;function mouseover(){tooltip.setAttribute("style", hoverStyle);};function mousemove(event, barX0data, barX1data, barYdata){mousePos = { x: event.clientX, y: event.clientY };tooltip.setAttribute("style", hoverStyle + `left: ${mousePos.x}px; top: ${mousePos.y}px`);tooltip.innerHTML = `${axislabels[1].textContent}: ${barX0data} - ${barX1data}<br><br>${axislabels[0].textContent}: ${barYdata}`;};function mouseout(){tooltip.setAttribute("style", normalStyle);};function mouseenter(bar) {bars.forEach((barEl) => {barEl.setAttribute("opacity", "0.7");});bar.setAttribute("opacity", "1");}function mouseleave() {bars.forEach((bar) => {bar.setAttribute("opacity", "1");});};bars.forEach((bar) => {const barX0data = bar.getAttribute("data-x0");const barX1data = bar.getAttribute("data-x1");const barYdata = bar.getAttribute("data-y");bar.addEventListener("mouseover", mouseover);bar.addEventListener("mousemove", (event) => mousemove(event, barX0data, barX1data, barYdata));bar.addEventListener("mouseout", mouseout);bar.addEventListener("mouseenter", () => mouseenter(bar));bar.addEventListener("mouseleave", mouseleave);});</script>'