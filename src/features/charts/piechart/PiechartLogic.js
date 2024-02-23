import * as d3 from "d3";

export const piechart = (selection, props) => {
    const { settingsRef, data } = props;

    //const { xColumn } = settingsRef.current.dataInput;

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
        colorscheme,
    } = settingsRef.current.chartelements;

    const {
        titleText,
        titleDistance,
        titleFontSize,
        titleColor,
        xaxisText,
        yaxisText, 
    } = settingsRef.current.label;

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

    let sum = 0;
    for (let i = 0; i < data.length; i++){
        sum += data[i].value;
    }

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
        //gehovertes slice hervorheben
        d3.selectAll('.slice').attr('opacity', '0.7');
        d3.select(this).attr('opacity', '1');
    }
    function mousemove(){
        let d = d3.select(this).data()[0]
        let valuePercent = d.value / sum * 100;
        tooltip
            .html(xaxisText + ': ' + d.data.key + '</br></br>'
                + yaxisText + ': ' + Math.round((valuePercent + Number.EPSILON) * 100) / 100 + '%')
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY) + 'px');
    }
    function mouseout(){
        tooltip.style('visibility', 'hidden');
        //Hervorhebung des gehoverten slices aufheben
        d3.selectAll('.slice').attr('opacity', '1');
    }
  
	const innerWidth = svgWidth - svgMarginLeft - svgMarginRight;
	const innerHeight = svgHeight - svgMarginTop - svgMarginBottom;
  
    let colorScale = d3.scaleOrdinal(colorDict[`${colorscheme}`])
  	    .domain(data.map(d => d.key))
	
    let pie = d3.pie()
        .value( d => d.value );
        //nicht benötigt da Array bereits vorher sortiert wird
        //.sortValues(function(a, b) { return b - a; })
  
    let radius = Math.min(innerWidth, innerHeight) / 2;
  
    let arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius * 0.8);
  
    var outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);
  
    let data_ready = pie(data);

    const background = selection.selectAll('.backgroundPieChart').data([null]);
    background.enter().append('rect')
            .attr('class', 'backgroundPieChart')
        .merge(background)
            .attr("height", svgHeight)
            .attr("width", svgWidth)
            .attr("fill", `rgba(${svgBg.r}, ${svgBg.g}, ${svgBg.b}, ${svgBg.a})`);
  
    const g = selection.selectAll('.containPieChart').data([null]);
  
    const gEnter = g.enter().append('g')
  	    .attr('class', 'containPieChart');
  
    gEnter
        .merge(g)
            .attr('transform',
                `translate(${svgMarginLeft},${svgMarginTop})`
            );
  
  
    const titleG = g.select('.titleChart');
    const titleGEnter = gEnter
        .append('g')
        .attr('class', 'titleChart');
    //titleText
    titleGEnter
        .append('text')
            .attr('class', 'titleText')
            .attr('text-anchor', 'middle')
        .merge(titleG.select('.titleText'))
            .attr('x', innerWidth / 2)
            .attr('y', titleDistance - svgMarginTop)
            .attr("data-xaxis", xaxisText)
            .attr("data-yaxis", yaxisText)
            .text(titleText)
            .attr('fill', `rgba(${titleColor.r}, ${titleColor.g}, ${titleColor.b}, ${titleColor.a})`)
            .attr("font-size", titleFontSize)
            .attr("font-family", fontFamily);
  
    const slices = g.merge(gEnter).selectAll('path').data(data_ready);
    slices.enter().append('path')
  		.attr('class', 'slice')
  		.attr("stroke", 'none')
  		.attr("stroke-width", "2px")
  		.attr("opacity", 0)
  		.attr('fill', 'white')
  	.merge(slices)
  	.on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout)
  		.attr('transform',
            `translate(${innerWidth/ 2},${innerHeight / 2})`
           )
    	.transition().delay(function(d,i) {
					return i * 500; }).duration(500)
			.attrTween('d', arcTween())
  		.attr('fill', d => colorScale(d.data.key))
  		.attr("opacity", 1);
  
    slices.exit().remove();
  
    // from http://bl.ocks.org/nadinesk/99393098950665c471e035ac517c2224
    function arcTween() {
        return function(d) {
            let interpolate = d3.interpolate(d.startAngle + 0.1, d.endAngle);
                return function(t) {
                    d.endAngle = interpolate(t);
                    return arc(d);
                };
        };
	}
  
    //von https://www.d3-graph-gallery.com/graph/donut_label.html
    const polyline = g.merge(gEnter).selectAll("polyline").data(data_ready);
        polyline.enter().append("polyline")
        .merge(polyline)
            .attr('transform',
                `translate(${innerWidth/ 2},${innerHeight / 2})`
            )
            .transition().delay(function(d,i) {
                        return i * 500; }).duration(500)
            .attr("stroke", `rgba(${tickLineColor.r}, ${tickLineColor.g}, ${tickLineColor.b}, ${tickLineColor.a})`)
            .attr("stroke-width", tickLineWidth)
        .style("fill", "none")
        .attr('points', function(d) {
            var posA = arc.centroid(d) // line insertion in the slice
            var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
            var posC = outerArc.centroid(d); // Label position = almost the same as posB
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
            posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                return [posA, posB, posC]
        });
    polyline.exit().remove();
    //damit polylines immer über den slices
    d3.selectAll('polyline').raise();
  
    const sliceLabels = g.merge(gEnter).selectAll('.sliceLabel').data(data_ready);
    sliceLabels.enter().append('text')
  		.attr('opacity', '0')
  	.merge(sliceLabels)
  		.attr('class', 'sliceLabel')
  		.text(d => d.data.key)
  		    .attr('transform', function(d) {
                var pos = outerArc.centroid(d);
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                    //folgende 2 Zeilen eingefügt damit Labels an den richtigen Stellen sind
                    pos[0] = pos[0] + innerWidth/2
                    pos[1] = pos[1] + innerHeight/2
                return 'translate(' + pos + ')';
            })
            .attr('text-anchor', function(d) {
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                return (midangle < Math.PI ? 'start' : 'end')
    	    })
            .attr("text-align", "middle")
            .attr("font-size", tickFontSize)
            .attr("fill", `rgba(${tickTextColor.r}, ${tickTextColor.g}, ${tickTextColor.b}, ${tickTextColor.a})`)
            .attr("font-family", fontFamily)
            .attr("data-x", d => d.data.key)
            .attr("data-y", d => {
                const valuePercent = d.value / sum * 100;
                return Math.round((valuePercent + Number.EPSILON) * 100) / 100;
            })
  		.transition().delay(function(d,i) {
					return i * 500; }).duration(500)
  		.attr('opacity', '1');
  
    sliceLabels.exit().remove();
};

export const piechartScript = '<script>const tooltipWrapper = document.getElementById("chart-tt-wrapper");const tooltip = tooltipWrapper.getElementsByClassName("chart-tt")[0];const svg = document.getElementById("piechartSVG");const titleText = svg.querySelectorAll(".titleText")[0];const slices = svg.querySelectorAll(".slice");const sliceLables = svg.querySelectorAll(".sliceLabel");const tooltipFontFamily = tooltip.getAttribute("data-font-family");const tooltipFontSize = tooltip.getAttribute("data-font-size");const tooltipLineHeight = tooltip.getAttribute("data-line-height");const tooltipMaxWidth = tooltip.getAttribute("data-max-width");const tooltipPadding = tooltip.getAttribute("data-padding");const tooltipBgColor = tooltip.getAttribute("data-background-color");const tooltipTextColor = tooltip.getAttribute("data-text-color");const normalStyle = `visibility: hidden; display: inline; position: absolute; text-align: left; max-width: ${tooltipMaxWidth}; max-height: 800px; padding: ${tooltipPadding}; border-radius: 8px; font-size: ${tooltipFontSize}; font-family: ${tooltipFontFamily}; line-height: ${tooltipLineHeight}; background-color: ${tooltipBgColor}; color: ${tooltipTextColor}; pointer-events: none; transform: translate(-100%, -100%);`;const hoverStyle = `visibility: visible; display: inline; position: absolute; text-align: left; max-width: ${tooltipMaxWidth}; max-height: 800px; padding: ${tooltipPadding}; border-radius: 8px; font-size: ${tooltipFontSize}; font-family: ${tooltipFontFamily}; line-height: ${tooltipLineHeight}; background-color: ${tooltipBgColor}; color: ${tooltipTextColor}; pointer-events: none; transform: translate(-100%, -100%);`;function mouseover(){tooltip.setAttribute("style", hoverStyle);};function mousemove(event, sliceXdata, sliceYdata){mousePos = { x: event.clientX, y: event.clientY };tooltip.setAttribute("style", hoverStyle + `left: ${mousePos.x}px; top: ${mousePos.y}px`);tooltip.innerHTML = `${titleText.getAttribute("data-xaxis")}: ${sliceXdata}<br><br>${titleText.getAttribute("data-yaxis")}: ${sliceYdata}%`;};function mouseout(){tooltip.setAttribute("style", normalStyle);};function mouseenter(element) {slices.forEach((sliceEl) => {sliceEl.setAttribute("opacity", "0.7");});element.setAttribute("opacity", "1");};function mouseleave () {slices.forEach((sliceEl) => {sliceEl.setAttribute("opacity", "1");});};sliceLables.forEach((sliceLabel, idx) => {const sliceXdata = sliceLabel.getAttribute("data-x");const sliceYdata = sliceLabel.getAttribute("data-y");slices[idx].addEventListener("mouseover", mouseover);slices[idx].addEventListener("mousemove", (event) => mousemove(event, sliceXdata, sliceYdata));slices[idx].addEventListener("mouseout", mouseout);slices[idx].addEventListener("mouseenter", () => mouseenter(slices[idx]));slices[idx].addEventListener("mouseleave", mouseleave);})</script>'