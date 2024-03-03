import * as d3 from "d3";

export const areachart = (selection, props) => {
	const { settingsRef, data, pathdata } = props;

    const { xColumn, yColumn } = settingsRef.current.dataInput;

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
        circleOpacity,
        circleRadius,
        lineWidth,
        lineColor,
        pointColor,
        areaColor,
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

    const xValue = d => d[xColumn];
    const yValue = d => d[yColumn];

    //select tooltipWrapper element on page
    const tooltipWrapper = d3.select('#chart-tt-wrapper');

    //make sure it is empty
    tooltipWrapper.html("");
  
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
    function mousemove(event){
        var x0 = xScale.invert(d3.pointer(event)[0]);
        var formatTime = d3.timeFormat("%H:%M %A %d.%m.%Y");
        var x0formated = formatTime(x0);
        
        var y0 = yScale.invert(d3.pointer(event)[1]);
        var y0rounded = Math.round((y0 + Number.EPSILON) * 100) / 100;
        
        tooltip
            .html(yaxisText + ': ' + y0rounded + '</br></br>' + xaxisText + ': ' + x0formated)
            .style('left', (event.pageX) + 'px')
            .style('top', (event.pageY) + 'px');
    }
    function mousemoveDatapoint(event){
        var d = d3.select(this).data()[0];
        var formatTime = d3.timeFormat("%H:%M %A %d.%m.%Y");
        var formated = formatTime(d[xColumn]);
        
        tooltip
            .html('<b><u>Datenpunkt</u></b> </br>' + yaxisText + ': ' + d[yColumn] + '</br></br>' + xaxisText + ': ' + formated)
            .style('left', (event.pageX) + 'px')
            .style('top', (event.pageY) + 'px');
    }
    function mouseout(){
        tooltip.style('visibility', 'hidden');
    }
  
    const innerWidth = svgWidth - svgMarginLeft - svgMarginRight;
    const innerHeight = svgHeight - svgMarginTop - svgMarginBottom;
  
    const duration = 1000;
  
    const xScale = d3.scaleTime()
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth]);
  
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, yValue)])
        .range([innerHeight, 0])
        .nice();

    const background = selection.selectAll('.backgroundAreaChart').data([null]);
    background.enter().append('rect')
            .attr('class', 'backgroundAreaChart')
        .merge(background)
            .attr("height", svgHeight)
            .attr("width", svgWidth)
            .attr("fill", `rgba(${svgBg.r}, ${svgBg.g}, ${svgBg.b}, ${svgBg.a})`);
  
    const g = selection.selectAll('.containAreaChart').data([null]);
    const gEnter = g.enter().append('g')
        .attr('class', 'containAreaChart');
  
    gEnter
        .merge(g)
            .attr('transform', 
                `translate(${svgMarginLeft},${svgMarginTop})`);
  
    const axisTickFormat = number =>
        d3.format('~s')(number)
            .replace('G', ' Mrd.')
            .replace('M', ' Mio.')
            .replace('k', ' Tsd.');
  
    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat("%d.%m.%Y"))
        .tickSize(-innerHeight)
        .tickPadding(20);
  
 	const yAxis = d3.axisLeft(yScale)
        .tickFormat(axisTickFormat)
        .tickSize(-innerWidth)
        .tickPadding(10);
  
    const yAxisG = g.select('.y-axis');
    const yAxisGEnter= gEnter
        .append('g')
            .attr('class', 'y-axis');
  
    yAxisG
        .merge(yAxisGEnter)
            .transition().duration(duration)
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
            .style('text-anchor', "middle")
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
            .transition().duration(duration)
            .call(xAxis);
    xAxisG
        .merge(xAxisGEnter)
        .selectAll('.tick line')
            .attr("stroke", `rgba(${tickLineColor.r}, ${tickLineColor.g}, ${tickLineColor.b}, ${tickLineColor.a})`)
            .attr("stroke-width", tickLineWidth);
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
  
    xAxisG.merge(xAxisGEnter).selectAll('.domain').remove();

    //xAxisLabelText
    xAxisGEnter
        .append('text')
            .attr('class', 'axis-label')
        .merge(xAxisG.select('.axis-label'))
            .attr('y', xaxisDistance)
            .attr('x', innerWidth/2)
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
      
	
    const areaGenerator = d3.area()
        .x(d => xScale(xValue(d)))
        .y0(innerHeight)
        .y1(d => yScale(yValue(d)));
        //weglassen, weil sonst Transition nicht funktioniert
        //.curve(curveBasis);
  
  
    const areas = g.merge(gEnter).selectAll('.area-path').data(pathdata);
    areas.enter().append('path')
        .merge(areas)
            .attr('class', 'area-path')
            .attr('stroke-width', 0) // muss wieder auf 0 gesetzt werden um bugs zu vermeiden
            .attr("stroke-linejoin", "round")
            .attr('d', d => areaGenerator(d.values))
            //.attr('d', areaGenerator(data))
            .transition().duration(duration)
            .attr("fill", `rgba(${areaColor.r}, ${areaColor.g}, ${areaColor.b}, ${areaColor.a})`)

    areas.exit().remove();
  
    const lineGenerator = d3.line()
        .x(d => xScale(xValue(d)))
        .y(d => yScale(yValue(d)));

    const lines = g.merge(gEnter).selectAll('.line-path').data(pathdata);
    lines.enter().append('path')
            .attr('opacity', 0)
            .attr('fill', 'none') //muss bei Path gemacht werden sonst wird Path ausgefüllt
            .attr("stroke-width", 0)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
        .merge(lines)
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout)
            .attr('class', 'line-path') //muss bei Path im merge block sein
            .attr('stroke-width', lineWidth)
            .attr("stroke", `rgba(${lineColor.r}, ${lineColor.g}, ${lineColor.b}, ${lineColor.a})`)
        .attr('d', d => lineGenerator(d.values))
        .transition().duration(duration)
        .attr('opacity', 1);

    lines.exit().remove();
  
    const circles = g.merge(gEnter).selectAll('circle').data(data);
    circles.enter().append('circle')
            .attr("class", "circle")
            .attr('opacity', 0)
        .merge(circles)
        .on('mouseover', mouseover)
        .on('mousemove', mousemoveDatapoint)
        .on('mouseout', mouseout)
            .attr('cy', d => yScale(yValue(d)))
            .attr('cx', d => xScale(xValue(d)))
            .attr('data-x', d => {
                var formatTime = d3.timeFormat("%H:%M %A %d.%m.%Y");
                return formatTime(d[xColumn]);
            })
            .attr('data-y', d => d[yColumn])
            .attr('r', circleRadius)
            .transition().duration(duration)
            .attr("fill", `rgb(${pointColor.r}, ${pointColor.g}, ${pointColor.b})`)
            .attr('opacity', circleOpacity);
  
    circles.exit().remove();
};

export const areachartScript = '<script>const tooltipWrapper = document.getElementById("chart-tt-wrapper");const tooltip = tooltipWrapper.getElementsByClassName("chart-tt")[0];const svg = document.getElementById("areachartSVG");const axislabels = svg.querySelectorAll(".axis-label");const circles = svg.querySelectorAll(".circle");const tooltipFontFamily = tooltip.getAttribute("data-font-family");const tooltipFontSize = tooltip.getAttribute("data-font-size");const tooltipLineHeight = tooltip.getAttribute("data-line-height");const tooltipMaxWidth = tooltip.getAttribute("data-max-width");const tooltipPadding = tooltip.getAttribute("data-padding");const tooltipBgColor = tooltip.getAttribute("data-background-color");const tooltipTextColor = tooltip.getAttribute("data-text-color");const normalStyle = `visibility: hidden; display: inline; position: absolute; text-align: left; max-width: ${tooltipMaxWidth}; max-height: 800px; padding: ${tooltipPadding}; border-radius: 8px; font-size: ${tooltipFontSize}; font-family: ${tooltipFontFamily}; line-height: ${tooltipLineHeight}; background-color: ${tooltipBgColor}; color: ${tooltipTextColor}; pointer-events: none; transform: translate(-100%, -100%);`;const hoverStyle = `visibility: visible; display: inline; position: absolute; text-align: left; max-width: ${tooltipMaxWidth}; max-height: 800px; padding: ${tooltipPadding}; border-radius: 8px; font-size: ${tooltipFontSize}; font-family: ${tooltipFontFamily}; line-height: ${tooltipLineHeight}; background-color: ${tooltipBgColor}; color: ${tooltipTextColor}; pointer-events: none; transform: translate(-100%, -100%);`;function mouseover(){tooltip.setAttribute("style", hoverStyle);};function mousemove(event, circleXdata, circleYdata){mousePos = { x: event.clientX, y: event.clientY };tooltip.setAttribute("style", hoverStyle + `left: ${mousePos.x}px; top: ${mousePos.y}px`);tooltip.innerHTML = `<b><u>Datenpunkt</u></b></br>${axislabels[0].textContent}: ${circleYdata}<br><br>${axislabels[1].textContent}: ${circleXdata}`;};function mouseout(){tooltip.setAttribute("style", normalStyle);};circles.forEach((circle) => { const circleXdata = circle.getAttribute("data-x");const circleYdata = circle.getAttribute("data-y");circle.addEventListener("mouseover", mouseover);circle.addEventListener("mousemove", (event) => mousemove(event, circleXdata, circleYdata));circle.addEventListener("mouseout", mouseout);});</script>'