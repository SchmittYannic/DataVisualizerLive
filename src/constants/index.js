import { IoBarChart } from "react-icons/io5";
import { BsFillPieChartFill } from "react-icons/bs";
import { AiFillBoxPlot, AiOutlineAreaChart } from "react-icons/ai";
import { GiHistogram } from "react-icons/gi";
import { BiLineChart } from "react-icons/bi";
import { PiChartScatterBold } from "react-icons/pi";

const ChartOptions = [
    { 
        name: "Säulendiagramm",
        action: "barchart",
        icon: <IoBarChart />
    }, 
    { 
        name: "Kreisdiagramm",
        action: "piechart",
        icon: <BsFillPieChartFill />
    }, 
    {
        name: "Boxplot",
        action: "boxplot",
        icon: <AiFillBoxPlot />
    },
    {
        name: "Histogramm",
        action: "histogram",
        icon: <GiHistogram />
    },
    {
        name: "Streudiagramm",
        action: "scatterplot",
        icon: <PiChartScatterBold />
    },
    {
        name: "Liniendiagramm",
        action: "linechart",
        icon: <BiLineChart />
    },
    {
        name: "Flächendiagramm",
        action: "areachart",
        icon: <AiOutlineAreaChart />
    }
];

const placeholderString = "keine Gruppierung";

const colorSchemeOptions = ["accent", "category10",  "dark2", "paired", "pastel1", "pastel2", "set1", "set2", "set3", "tableau10"];

export {
    ChartOptions,
    placeholderString,
    colorSchemeOptions,
}