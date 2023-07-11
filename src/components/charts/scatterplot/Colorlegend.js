export const colorlegend = (selection, props) => {
    const {
        colorScale,
        positionX,
        positionY,
        tickRadius,
        tickSpacing,
        tickPadding,
        label,
        labelX,
        labelY,
        labelFont
    } = props;

    const legendLabelColor = "#8E8883";
    const legendLabelFontSize = "20px";
    
    let legendG = selection
        .selectAll(".legendScatterPlot--color")
        .data([null]);
    legendG = legendG
        .enter().append("g")
            .attr("class", "legendScatterPlot legendScatterPlot--color")
        .merge(legendG)
            .attr("transform", `translate(${positionX}, ${positionY})`);
    
    const legendLabel = legendG
        .selectAll(".legendScatterPlot__label")
        .data([null]);
    legendLabel
        .enter().append("text")
            .attr("class", "legendScatterPlot__label")
            .attr("fill", legendLabelColor)
            .attr("font-size", legendLabelFontSize)
            .attr('opacity', '0')
        .merge(legendLabel)
            .attr("x", labelX)
            .attr("y", labelY)
            .attr("font-family", labelFont)
        .text(label)
            .transition().duration(2500)
            .attr('opacity', '1');
    
    const ticks = legendG
        .selectAll(".tick")
        .data(colorScale.domain());
    const ticksEnter = ticks
        .enter().append("g")
            .attr("class", "tick");
    ticksEnter
        .merge(ticks)
            .attr("transform", (d, i) => `translate(0, ${i * tickSpacing})`);
    ticks.exit().remove();
    
    ticksEnter
        .append("circle")
            .attr('opacity', '0')
        .merge(ticks.select("circle"))
            .attr("r", tickRadius)
            .attr("fill", colorScale)
            .transition().duration(2500)
            .attr('opacity', '1');
    
    ticksEnter
        .append("text")
            .attr('opacity', '0')
            .style('font-size', '12px')
            .style('fill', '#635F5D')
        .merge(ticks.select("text"))
            .attr("x", tickRadius + tickPadding)
            .attr('y', 3) // TickLabelYPosition
            .attr("font-family", labelFont)
        .text(d => d)
            .transition().duration(2500)
            .attr('opacity', '1');
};