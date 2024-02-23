import * as d3 from "d3";

export const barchart = (selection, props) => {
	const { settingsRef, data } = props;

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
        xaxisDistance,
        xaxisFontSize,
        xaxisColor,
        yaxisText,
        yaxisDistance,
        yaxisFontSize,
        yaxisColor,
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

    const yValue = d => d.value

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
    function mousemove(){
        let d = d3.select(this).data()[0]
        tooltip
        .html(xaxisText + ': ' + d.key + '</br></br>' 
                + yaxisText + ': ' + d.value)
        .style('left', (d3.event.pageX) + 'px')
        .style('top', (d3.event.pageY) + 'px');
    }
    function mouseout(){
        tooltip.style('visibility', 'hidden');
    }

	const innerWidth = svgWidth - svgMarginLeft - svgMarginRight;
    const innerHeight = svgHeight - svgMarginTop - svgMarginBottom;
  
    const xScale = d3.scaleBand()
        .range([0, innerWidth])
        .domain(data.map((d) => d.key))
        .padding(0.3);
  
    const yScale = d3.scaleLinear()
        .range([innerHeight, 0])
        .domain([0, d3.max(data, yValue)])
            .nice();
  
    const colorScale = d3.scaleOrdinal(colorDict[`${colorscheme}`])
        .domain(data.map(d => d.key));

    const background = selection.selectAll('.backgroundBarChart').data([null]);
    background.enter().append('rect')
            .attr('class', 'backgroundBarChart')
        .merge(background)
            .attr("height", svgHeight)
            .attr("width", svgWidth)
            .attr("fill", `rgba(${svgBg.r}, ${svgBg.g}, ${svgBg.b}, ${svgBg.a})`);
  
    const g = selection.selectAll('.containBarChart').data([null]);
    const gEnter = g.enter().append('g')
        .attr('class', 'containBarChart');
  
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
       
    let customFormat = function(val) { 
        return Math.abs(val) < 1 ? formatSmall(val) : formatLarge(val);
    };

    const xAxis = d3.axisBottom(xScale)
        //.tickSize(-innerHeight)
        .tickPadding(10);
  
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
            .transition().duration(500)
            .call(yAxis);
    yAxisG
        .merge(yAxisGEnter)
        .selectAll('.tick line')
            .attr("stroke", `rgba(${tickLineColor.r}, ${tickLineColor.g}, ${tickLineColor.b}, ${tickLineColor.a})`)
            .attr("stroke-width", tickLineWidth);

    yAxisG
        .merge(yAxisGEnter)  
        .selectAll('.tick text')
            .attr("font-size", tickFontSize)
            .attr("font-family", fontFamily)
            .attr("fill", `rgba(${tickTextColor.r}, ${tickTextColor.g}, ${tickTextColor.b}, ${tickTextColor.a})`);
    yAxisG
        .merge(yAxisGEnter)
        .selectAll('.domain').remove();
    //yAxisLabelText
    yAxisGEnter
        .append('text')
            .attr('class', 'axis-label')
            .attr('transform', `rotate(-90)`)
            .attr('text-anchor', 'middle')
        .merge(yAxisG.select('.axis-label'))
            .attr('y', -yaxisDistance)
            .attr('x', -innerHeight/2)
            .text(yaxisText)
            .attr("font-family", fontFamily)
            .attr("font-size", yaxisFontSize)
            .attr('fill', `rgba(${yaxisColor.r}, ${yaxisColor.g}, ${yaxisColor.b}, ${yaxisColor.a})`);
  
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
    xAxisG
        .merge(xAxisGEnter)
        .selectAll('.tick text')
            .attr('text-anchor', 'end')
            .attr("dx", "-.8em")
            .attr("font-size", tickFontSize)
            .attr("font-family", fontFamily)
            .attr("fill", `rgba(${tickTextColor.r}, ${tickTextColor.g}, ${tickTextColor.b}, ${tickTextColor.a})`)
        .attr("dy", ".15em")
            .attr("transform", function(d) {
                    return "rotate(-30)" 
                    });
  
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
            .attr("font-size", xaxisFontSize)
            .attr("font-family", fontFamily)
            .attr('fill', `rgba(${xaxisColor.r}, ${xaxisColor.g}, ${xaxisColor.b}, ${xaxisColor.a})`);
  
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
            .attr('y', titleDistance - svgMarginTop) //-svgMarginTop / 2
            .text(titleText)
            .attr('fill', `rgba(${titleColor.r}, ${titleColor.g}, ${titleColor.b}, ${titleColor.a})`)
            .attr("font-size", titleFontSize)
            .attr("font-family", fontFamily);
      
  
    const rectangles = g.merge(gEnter).selectAll('rect').data(data);
    rectangles.enter().append('rect')
        .merge(rectangles)
            .attr('class', 'bar')
            .attr('opacity', 0) // muss im merge sein
            .attr('x', d => xScale(d.key))
            .attr('y', d => yScale(yValue(d)))
            .attr('width', xScale.bandwidth())
            .attr('height', d => innerHeight - yScale(yValue(d)))
            .attr('fill', d => colorScale(d.key))
            .attr("data-x", d => yValue(d))
            .attr("data-y", d => d.key)
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout)
        .on('mouseenter', function(actual, i){
    		//Alle Rechtecke werden durchsichtig
  			d3.selectAll('.bar')
    			.attr('opacity', 0.7);
    		//Value der Bar wird unsichtbar wenn über Bar gehovert
    		d3.selectAll('.barValue')
    			.attr('opacity', 0);
    		//gehoverte Bar wird ausgewählt und undurchsichtig gemacht
    		d3.select(this)
    			.attr('opacity', 1)
    			//Animation
                .transition()
                .duration(300);
  				//gehoverte Bar wird dicker
            //.attr('x', d => xScale(d.key) - 5)
            //.attr('width', xScale.bandwidth() + 10)
    		
    		//const y = yScale(actual.value);
        
            //gibt erlaubte Anzahl an Nachkommastellen an für Differenzwerte
            const fixedValue = 0;
        
            const divergenceText = g.merge(gEnter).selectAll('.divergence').data(data);
            divergenceText.enter()
                .append('text')
                    .attr('class', 'divergence')
                    .attr('text-anchor', 'middle')
                .merge(divergenceText)
                    .attr('x', d => xScale(d.key) + xScale.bandwidth() / 2)
                    .attr('y', d => yScale(d.value) - 5)
                    .attr('fill', `rgba(${tickTextColor.r}, ${tickTextColor.g}, ${tickTextColor.b}, ${tickTextColor.a})`)
                    .attr("font-size", tickFontSize)
                    .attr("font-family", fontFamily)
                .text((d, idx) => {
                    const divergence = (d.value - actual.value).toFixed(fixedValue);
                
                    let text = '';
                    if (divergence > 0) text += '+';
                    text += `${divergence}`;

                    return idx !== i ? text : '';
                });
  	    })
        .on('mouseleave', function () {
            //alle Bars wieder undurchsichtig
            d3.selectAll('.bar')
                .attr('opacity', 1);
            //Value der Bar wird sichtbar gemacht
            d3.selectAll('.barValue')
                .attr('opacity', 1);
                
            //gehoverte Rechteck wieder auf normal Größe schrumpfen
            d3.select(this)
                .transition()
                .duration(300);
            //.attr('opacity', 1)
            //.attr('x', d => xScale(d.key))
            //.attr('width', xScale.bandwidth())

                //Differenzwerte löschen
            d3.selectAll('.divergence').remove();
        })
        .transition().duration(1000) //muss hinter den Mausfunktionen stehen
        .attr('opacity', 1);
  
    rectangles.exit().remove();
  
  
    const barValueText = g.merge(gEnter).selectAll('.barValue').data(data);
  
    barValueText.enter().append('text')
        .attr('text-anchor', 'middle')
        .merge(barValueText)
            .attr('class', 'barValue')
            .attr("font-size", tickFontSize)
            .attr("font-family", fontFamily)
            .attr("fill", `rgba(${tickTextColor.r}, ${tickTextColor.g}, ${tickTextColor.b}, ${tickTextColor.a})`)
            .attr('x', d => xScale(d.key) + xScale.bandwidth() / 2)
            .attr('y', d => yScale(d.value) - 5)
        .text( d => `${d.value}`);
  
    barValueText.exit().remove();
};

//exports a string containing a script tag
//the script can be used in combination with the outerHTML of the Tooltip and the SVG
//to preserve the interactability with the chart even without D3 
//(script contains the necessary eventlisteners)
//using https://www.browserling.com/tools/remove-all-whitespace to get rid of whitespaces
export const barchartScript = '<script>const tooltipWrapper = document.getElementById("chart-tt-wrapper");const tooltip = tooltipWrapper.getElementsByClassName("chart-tt")[0];const svg = document.getElementById("barchartSVG");const axislabels = svg.querySelectorAll(".axis-label");const bars = svg.querySelectorAll(".bar");const barValues = svg.querySelectorAll(".barValue");const containBarChart = svg.getElementsByClassName("containBarChart")[0];const tooltipFontFamily = tooltip.getAttribute("data-font-family");const tooltipFontSize = tooltip.getAttribute("data-font-size");const tooltipLineHeight = tooltip.getAttribute("data-line-height");const tooltipMaxWidth = tooltip.getAttribute("data-max-width");const tooltipPadding = tooltip.getAttribute("data-padding");const tooltipBgColor = tooltip.getAttribute("data-background-color");const tooltipTextColor = tooltip.getAttribute("data-text-color");const normalStyle = `visibility: hidden; display: inline; position: absolute; text-align: left; max-width: ${tooltipMaxWidth}; max-height: 800px; padding: ${tooltipPadding}; border-radius: 8px; font-size: ${tooltipFontSize}; font-family: ${tooltipFontFamily}; line-height: ${tooltipLineHeight}; background-color: ${tooltipBgColor}; color: ${tooltipTextColor}; pointer-events: none; transform: translate(-100%, -100%);`;const hoverStyle = `visibility: visible; display: inline; position: absolute; text-align: left; max-width: ${tooltipMaxWidth}; max-height: 800px; padding: ${tooltipPadding}; border-radius: 8px; font-size: ${tooltipFontSize}; font-family: ${tooltipFontFamily}; line-height: ${tooltipLineHeight}; background-color: ${tooltipBgColor}; color: ${tooltipTextColor}; pointer-events: none; transform: translate(-100%, -100%);`;function mouseover(){tooltip.setAttribute("style", hoverStyle);};function mousemove(event, barXdata, barYdata){mousePos = { x: event.clientX, y: event.clientY };tooltip.setAttribute("style", hoverStyle + `left: ${mousePos.x}px; top: ${mousePos.y}px`);tooltip.innerHTML = `${axislabels[1].textContent}: ${barYdata}<br><br>${axislabels[0].textContent}: ${barXdata}`;};function mouseout(){tooltip.setAttribute("style", normalStyle);};function mouseenter(bar) {bars.forEach((barEl) => {barEl.setAttribute("opacity", "0.7");if (barEl != bar) {const textEl = document.createElementNS("http://www.w3.org/2000/svg", "text");textEl.setAttribute("class", "divergence");textEl.setAttribute("fill", "#634F5D");textEl.setAttribute("font-size", "13px");textEl.setAttribute("text-anchor", "middle");textEl.setAttribute("x", Number(barEl.getAttribute("x")) + Number((barEl.getAttribute("width")) / 2));textEl.setAttribute("y", barEl.getAttribute("y") - 5);const divergence = (barEl.getAttribute("data-x") - bar.getAttribute("data-x")).toFixed(0);textEl.textContent = divergence > 0 ? "+" + divergence : divergence;containBarChart.append(textEl);}});bar.setAttribute("opacity", "1");barValues.forEach((value) => {value.setAttribute("opacity", "0");});}function mouseleave () {const divergenceText = containBarChart.querySelectorAll(".divergence");divergenceText.forEach((text) => {text.remove();});barValues.forEach((value) => {value.setAttribute("opacity", "1");});bars.forEach((bar) => {bar.setAttribute("opacity", "1");});};bars.forEach((bar) => {const barXdata = bar.getAttribute("data-x");const barYdata = bar.getAttribute("data-y");bar.addEventListener("mouseover", mouseover);bar.addEventListener("mousemove", (event) => mousemove(event, barXdata, barYdata));bar.addEventListener("mouseout", mouseout);bar.addEventListener("mouseenter", () => mouseenter(bar));bar.addEventListener("mouseleave", mouseleave);});</script>'