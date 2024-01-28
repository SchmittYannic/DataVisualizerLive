import * as d3 from "d3";

export const boxplot = (selection, props) => {
	const { settingsRef, data } = props;

    //const { xColumn, zGrouping } = settingsRef.current.dataInput;

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

    //styling
    const iqrStrokeColor = "black";
    const iqrStrokeWidth = "1px";
    const outlierStrokeWidth = "1.5px";
    const outlierStrokeColor = "black";

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
        d3.selectAll('.iqr').attr('opacity', '0.7');
        d3.selectAll('.highOutlier').attr('opacity', '0.7');
        d3.selectAll('.lowOutlier').attr('opacity', '0.7');
        d3.select(this).attr('opacity', '1');
    }
    function mousemoveIqr(){
        let d = d3.select(this).data()[0];
        tooltip
            .html('Maximum: ' + Math.round((d.value.max + Number.EPSILON) * 100) / 100 + '</br>' +
                '3.Quantil: ' + Math.round((d.value.q3 + Number.EPSILON) * 100) / 100 + '</br>' +
                'Median: ' + Math.round((d.value.median + Number.EPSILON) * 100) / 100 + '</br>' +
                '1.Quantil: ' + Math.round((d.value.q1 + Number.EPSILON) * 100) / 100 + '</br>' +
                'Minimum: ' + Math.round((d.value.min + Number.EPSILON) * 100) / 100 + '</br>' +
                'Schiefe: ' + Math.round((d.value.skewness + Number.EPSILON) * 100) / 100 + '</br>' +
                'Wölbung: ' + Math.round((d.value.kurtosis + Number.EPSILON) * 100) / 100)
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY) + 'px');
    }
    function mouseout(){
        tooltip.style('visibility', 'hidden');
        d3.selectAll('.iqr').attr('opacity', '1');
        d3.selectAll('.highOutlier').attr('opacity', '1');
        d3.selectAll('.lowOutlier').attr('opacity', '1');
    }

    function mousemoveCircle(){
        let d = yScale.invert(d3.select(this).attr('cy'));
        
        tooltip
            .html('Ausreißer: ' + Math.round((d + Number.EPSILON) * 100) / 100)
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY) + 'px');
    }

  
    const innerWidth = svgWidth - svgMarginLeft - svgMarginRight;
    const innerHeight = svgHeight - svgMarginTop - svgMarginBottom;
  
    const duration = 1000;
  
    const arrayOfMinimum = data.map(d => d.value.min);
    const arrayOfMaximum = data.map(d => d.value.max);
  
    const yScale = d3.scaleLinear()
        .range([innerHeight, 0])
        .domain([d3.min(arrayOfMinimum), d3.max(arrayOfMaximum)])
        .nice();

    const xScale = d3.scaleBand()
        .range([0, innerWidth])
        .domain(data.map(d => d.key))
        .padding(0.6);
  
    const colorScale = d3.scaleOrdinal(colorDict[`${colorscheme}`])
        .domain(data.map(d => d.key));

    const background = selection.selectAll('.backgroundBoxplot').data([null]);
    background.enter().append('rect')
            .attr('class', 'backgroundBoxplot')
        .merge(background)
            .attr("height", svgHeight)
            .attr("width", svgWidth)
            .attr("fill", `rgba(${svgBg.r}, ${svgBg.g}, ${svgBg.b}, ${svgBg.a})`);
  
    const g = selection.selectAll('.containBoxplot').data([null]);
    const gEnter = g.enter().append('g')
        .attr('class', 'containBoxplot');
  
    gEnter
        .merge(g)
            .attr('transform',
                `translate(${svgMarginLeft},${svgMarginTop})`
            );

    const formatLarge = d =>
        d3.format('~s')(d)
        .replace('G', ' Mrd.')
        .replace('M', ' Mio.')
        .replace('k', ' Tsd.');
         
    const formatSmall = d3.format('~f');
       
    let customFormat = function(d) { 
        return Math.abs(d) < 1 ? formatSmall(d) : formatLarge(d);
    };
  
    const xAxis = d3.axisBottom(xScale)
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
            .transition().duration(duration)
            .call(yAxis);
    yAxisG
        .merge(yAxisGEnter)
        .selectAll('.tick line')
            .attr("stroke", `rgba(${tickLineColor.r}, ${tickLineColor.g}, ${tickLineColor.b}, ${tickLineColor.a})`)
            .attr("stroke-width", tickLineWidth);
    yAxisG
        .merge(yAxisGEnter)
        .selectAll(".tick text")          
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
            .attr("fill", `rgba(${tickTextColor.r}, ${tickTextColor.g}, ${tickTextColor.b}, ${tickTextColor.a})`)
            .attr("font-size", tickFontSize)
            .attr("font-family", fontFamily)
        .attr("dy", ".15em")
            .attr("transform", function(d) {
                    return "rotate(-30)" 
                });
  
    xAxisG
        .merge(xAxisGEnter)
        .selectAll('.domain').remove();
  
    xAxisG
        .merge(xAxisGEnter)
        .selectAll('.tick line').remove();
	
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


    const rectangles = g.merge(gEnter).selectAll('.iqr').data(data);
    rectangles.enter().append('rect')
            .attr('opacity', 0)
        .merge(rectangles)
        .on('mouseover', mouseover)
        .on('mousemove', mousemoveIqr)
        .on('mouseout', mouseout)
            .attr('class', 'iqr')
            .attr('rx', '5')
            .attr('fill', d => colorScale(d.key))
            .attr('x', d => xScale(d.key))
            .attr('y', d => yScale(d.value.q3))
            .attr("data-maximum", d => Math.round((d.value.max + Number.EPSILON) * 100) / 100)
            .attr("data-quantil3", d => Math.round((d.value.q3 + Number.EPSILON) * 100) / 100)
            .attr("data-median", d => Math.round((d.value.median + Number.EPSILON) * 100) / 100)
            .attr("data-quantil1", d => Math.round((d.value.q1 + Number.EPSILON) * 100) / 100)
            .attr("data-minimum", d => Math.round((d.value.min + Number.EPSILON) * 100) / 100)
            .attr("data-skewness", d => Math.round((d.value.skewness + Number.EPSILON) * 100) / 100)
            .attr("data-kurtosis", d => Math.round((d.value.kurtosis + Number.EPSILON) * 100) / 100)
            .attr('width', xScale.bandwidth())
            .attr("stroke-width", iqrStrokeWidth)
            .attr("stroke", iqrStrokeColor)
        //Höhe darf nicht durch innerHeight - yScale(d.iqr) berechnet werden
        //da es ansonsten zu bugs kommt, wenn iqr kleiner ist als das
        //Minimum der Skalar. Genauer gesagt wird in diesem Fall die Höhe negativ.
        .attr('height', d => yScale(d.value.q1) - yScale(d.value.q3))
            .transition().duration(duration)
            .attr('opacity', 1);
    rectangles.exit().remove();
  
    const medianLine = g.merge(gEnter).selectAll('.medianLine').data(data);
    medianLine.enter().append('line')
        .merge(medianLine)
            .attr('class', 'medianLine')
            .style('stroke', 'black')
            .attr('x1', d => xScale(d.key))
            .attr('x2', d => xScale(d.key) + xScale.bandwidth())
            .attr('y1', d => yScale(d.value.median))
            .attr('y2', d => yScale(d.value.median))
            .transition().duration(duration)
            .attr('opacity', 1);
    medianLine.exit().remove();
  
  
    const upperWhiskerHor = g.merge(gEnter).selectAll('.upperWhiskerHor').data(data);
    upperWhiskerHor.enter().append('line')
        .merge(upperWhiskerHor)
            .attr('class', 'upperWhiskerHor')
            .style('stroke', 'black')
            .attr('x1', d => xScale(d.key))
            .attr('x2', d => xScale(d.key) + xScale.bandwidth())
            .attr('y1', d => yScale(d3.min([d.value.max, d.value.upperIqr])))
            .attr('y2', d => yScale(d3.min([d.value.max, d.value.upperIqr])))
            .transition().duration(duration)
            .attr('opacity', 1);
    upperWhiskerHor.exit().remove();
  
    const lowerWhiskerHor = g.merge(gEnter).selectAll('.lowerWhiskerHor').data(data);
    lowerWhiskerHor.enter().append('line')
        .merge(lowerWhiskerHor)
            .attr('class', 'lowerWhiskerHor')
            .style('stroke', 'black')
            .attr('x1', d => xScale(d.key))
            .attr('x2', d => xScale(d.key) + xScale.bandwidth())
            .attr('y1', d => yScale(d3.max([d.value.min, d.value.lowerIqr])))
            .attr('y2', d => yScale(d3.max([d.value.min, d.value.lowerIqr])))
            .transition().duration(duration)
            .attr('opacity', 1);
    lowerWhiskerHor.exit().remove();
  
    const upperWhiskerVert = g.merge(gEnter).selectAll('.upperWhiskerVert').data(data);
    upperWhiskerVert.enter().append('line')
        .merge(upperWhiskerVert)
            .attr('class', 'upperWhiskerVert')
            .style('stroke', 'black')
            .attr('x1', d => xScale(d.key) + xScale.bandwidth() / 2)
            .attr('x2', d => xScale(d.key) + xScale.bandwidth() / 2)
            .attr('y1', d => yScale(d.value.q3))
            .attr('y2', d => yScale(d3.min([d.value.max, d.value.upperIqr])))
            .transition().duration(duration)
            .attr('opacity', 1);
    upperWhiskerVert.exit().remove();
  
    const lowerWhiskerVert = g.merge(gEnter).selectAll('.lowerWhiskerVert').data(data);
    lowerWhiskerVert.enter().append('line')
        .merge(lowerWhiskerVert)
            .attr('class', 'lowerWhiskerVert')
            .style('stroke', 'black')
            .attr('x1', d => xScale(d.key) + xScale.bandwidth() / 2)
            .attr('x2', d => xScale(d.key) + xScale.bandwidth() / 2)
            .attr('y1', d => yScale(d.value.q1))
            .attr('y2', d => yScale(d3.max([d.value.min, d.value.lowerIqr])))
            .transition().duration(duration)
            .attr('opacity', 1);
    lowerWhiskerVert.exit().remove();

    /* 
        seeding randomNumber generator to make sure the outliers are placed at the same spot
        for subsequent renders.
        source: https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
    */
    const seed = cyrb128("apples");
    const rand = mulberry32(seed[0]);
  
    function randomNumber(){
        let jitterWidth = xScale.bandwidth() / 3;
        let randomNumber = Math.floor(rand()*jitterWidth);
        randomNumber *= Math.floor(rand()*2) === 1 ? 1 : -1;
        
        return randomNumber
    }

    function cyrb128(str) {
        let h1 = 1779033703, h2 = 3144134277,
            h3 = 1013904242, h4 = 2773480762;
        for (let i = 0, k; i < str.length; i++) {
            k = str.charCodeAt(i);
            h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
            h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
            h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
            h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
        }
        h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
        h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
        h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
        h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
        return [(h1^h2^h3^h4)>>>0, (h2^h1)>>>0, (h3^h1)>>>0, (h4^h1)>>>0];
    }

    function mulberry32(a) {
        return function() {
          var t = a += 0x6D2B79F5;
          t = Math.imul(t ^ (t >>> 15), t | 1);
          t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        }
    }

    function createHighOutlierData(data){
        let list = [];
        for (let i = 0; i < data.length; i++){
            for (let j = 0; j < data[i].value.highOutlier.length; j++){
                let e = {};
                e['key'] = data[i].key;
                e['value'] = data[i].value.highOutlier[j];
                list.push(e);
            }
        }
        return list
    }

    function createLowOutlierData(data){
        let list = [];
        for (let i = 0; i < data.length; i++){
            for (let j = 0; j < data[i].value.lowOutlier.length; j++){
                let e = {};
                e['key'] = data[i].key;
                e['value'] = data[i].value.lowOutlier[j];
                list.push(e);
            }
        }
        return list
    }

    const highOutlierData = createHighOutlierData(data);
    const lowOutlierData = createLowOutlierData(data);

    const highOutlier = g.merge(gEnter).selectAll('.highOutlier').data(highOutlierData);
    highOutlier.enter().append('circle')
        .merge(highOutlier)
            .attr('class', 'highOutlier')
        .on('mouseover', mouseover)
        .on('mousemove', mousemoveCircle)
        .on('mouseout', mouseout)
            .style("stroke", outlierStrokeColor)
            .style("stroke-width", outlierStrokeWidth)
            .style('fill', d => colorScale(d.key))
            .attr('r', 4)
            .attr('cx', d => xScale(d.key) + xScale.bandwidth() / 2 - randomNumber())
            .attr('cy', d => yScale(d.value))
            .attr("data-y", d => Math.round((d.value + Number.EPSILON) * 100) / 100)
        .transition()
        .duration(duration)
            .attr("opacity", 1);
    highOutlier.exit().remove();
  

    const lowOutlier = g.merge(gEnter).selectAll('.lowOutlier').data(lowOutlierData);
    lowOutlier.enter().append('circle')
        .merge(lowOutlier)
            .attr('class', 'lowOutlier')
        .on('mouseover', mouseover)
        .on('mousemove', mousemoveCircle)
        .on('mouseout', mouseout)
            .style("stroke", "black")
            .style("stroke-width", outlierStrokeWidth)
            .style('fill', d => colorScale(d.key))
            .attr('r', 4)
            .attr('cx', d => xScale(d.key) + xScale.bandwidth() / 2 - randomNumber())
            .attr('cy', d => yScale(d.value))
            .attr("data-y", d => Math.round((d.value + Number.EPSILON) * 100) / 100)
        .transition()
        .duration(duration)
            .attr("opacity", 1);
    lowOutlier.exit().remove();

    gEnter.selectAll('.lowOutlier').raise();
    gEnter.selectAll('.highOutlier').raise();
};

export const boxplotScript = '<script>const tooltipWrapper = document.getElementById("chart-tt-wrapper");const tooltip = tooltipWrapper.getElementsByClassName("chart-tt")[0];const svg = document.getElementById("boxplotSVG");const iqrs = svg.querySelectorAll(".iqr");const highOutliers = svg.querySelectorAll(".highOutlier");const lowOutliers = svg.querySelectorAll(".lowOutlier");const tooltipFontFamily = tooltip.getAttribute("data-font-family");const tooltipFontSize = tooltip.getAttribute("data-font-size");const tooltipLineHeight = tooltip.getAttribute("data-line-height");const tooltipMaxWidth = tooltip.getAttribute("data-max-width");const tooltipPadding = tooltip.getAttribute("data-padding");const tooltipBgColor = tooltip.getAttribute("data-background-color");const tooltipTextColor = tooltip.getAttribute("data-text-color");const normalStyle = `visibility: hidden; display: inline; position: absolute; text-align: left; max-width: ${tooltipMaxWidth}; max-height: 800px; padding: ${tooltipPadding}; border-radius: 8px; font-size: ${tooltipFontSize}; font-family: ${tooltipFontFamily}; line-height: ${tooltipLineHeight}; background-color: ${tooltipBgColor}; color: ${tooltipTextColor}; pointer-events: none; transform: translate(-100%, -100%);`;const hoverStyle = `visibility: visible; display: inline; position: absolute; text-align: left; max-width: ${tooltipMaxWidth}; max-height: 800px; padding: ${tooltipPadding}; border-radius: 8px; font-size: ${tooltipFontSize}; font-family: ${tooltipFontFamily}; line-height: ${tooltipLineHeight}; background-color: ${tooltipBgColor}; color: ${tooltipTextColor}; pointer-events: none; transform: translate(-100%, -100%);`;function mouseover(){tooltip.setAttribute("style", hoverStyle);};function mousemoveIqr(event, iqrMaximum, iqrQuantil3, iqrMedian, iqrQuantil1, iqrMinimum, iqrSkewness, iqrKurtosis){mousePos = { x: event.clientX, y: event.clientY };tooltip.setAttribute("style", hoverStyle + `left: ${mousePos.x}px; top: ${mousePos.y}px`);tooltip.innerHTML = `Maximum: ${iqrMaximum}<br>3.Quantil: ${iqrQuantil3}<br>Median: ${iqrMedian}<br>1.Quantil: ${iqrQuantil1}<br>Minimum: ${iqrMinimum}<br>Schiefe: ${iqrSkewness}<br>Wölbung: ${iqrKurtosis}`;};function mouseout(){tooltip.setAttribute("style", normalStyle);};function mousemoveCircle(event, outlierDataY) {mousePos = { x: event.clientX, y: event.clientY };tooltip.setAttribute("style", hoverStyle + `left: ${mousePos.x}px; top: ${mousePos.y}px`);tooltip.innerHTML = `Ausreißer: ${outlierDataY}`;};function mouseenter(element) {iqrs.forEach((iqrEl) => {iqrEl.setAttribute("opacity", "0.7");});lowOutliers.forEach((lowOutlierEl) => {lowOutlierEl.setAttribute("opacity", "0.7");});highOutliers.forEach((highOutlierEl) => {highOutlierEl.setAttribute("opacity", "0.7");});element.setAttribute("opacity", "1");}function mouseleave() {iqrs.forEach((iqrEl) => {iqrEl.setAttribute("opacity", "1");});lowOutliers.forEach((lowOutlierEl) => {lowOutlierEl.setAttribute("opacity", "1");});highOutliers.forEach((highOutlierEl) => {highOutlierEl.setAttribute("opacity", "1");});};iqrs.forEach((iqr) => {const iqrMaximum = iqr.getAttribute("data-maximum");const iqrQuantil3 = iqr.getAttribute("data-quantil3");const iqrMedian = iqr.getAttribute("data-median");const iqrQuantil1 = iqr.getAttribute("data-quantil1");const iqrMinimum = iqr.getAttribute("data-minimum");const iqrSkewness = iqr.getAttribute("data-skewness");const iqrKurtosis = iqr.getAttribute("data-kurtosis");iqr.addEventListener("mouseover", mouseover);iqr.addEventListener("mousemove", (event) => mousemoveIqr(event, iqrMaximum, iqrQuantil3, iqrMedian, iqrQuantil1, iqrMinimum, iqrSkewness, iqrKurtosis));iqr.addEventListener("mouseout", mouseout);iqr.addEventListener("mouseenter", () => mouseenter(iqr));iqr.addEventListener("mouseleave", mouseleave);});lowOutliers.forEach((outlier) => {const outlierDataY = outlier.getAttribute("data-y");outlier.addEventListener("mouseover", mouseover);outlier.addEventListener("mousemove", (event) => mousemoveCircle(event, outlierDataY));outlier.addEventListener("mouseout", mouseout);outlier.addEventListener("mouseenter", () => mouseenter(outlier));outlier.addEventListener("mouseleave", mouseleave);});highOutliers.forEach((outlier) => {const outlierDataY = outlier.getAttribute("data-y");outlier.addEventListener("mouseover", mouseover);outlier.addEventListener("mousemove", (event) => mousemoveCircle(event, outlierDataY));outlier.addEventListener("mouseout", mouseout);outlier.addEventListener("mouseenter", () => mouseenter(outlier));outlier.addEventListener("mouseleave", mouseleave);});</script>'