const ChartOptions = [
    { 
        name: "Säulendiagramm",
        action: "barchart",
    }, 
    { 
        name: "Kreisdiagramm",
        action: "piechart",
    }, 
    {
        name: "Boxplot",
        action: "boxplot",
    },
    {
        name: "Histogramm",
        action: "histogram",
    },
    {
        name: "Streudiagramm",
        action: "scatterplot",
    },
    {
        name: "Liniendiagramm",
        action: "linechart",
    },
    {
        name: "Flächendiagramm",
        action: "areachart",
    }
];

const placeholderString = "keine Gruppierung";

const colorSchemeOptions = ["accent", "category10",  "dark2", "paired", "pastel1", "pastel2", "set1", "set2", "set3", "tableau10"];

export {
    ChartOptions,
    placeholderString,
    colorSchemeOptions,
}