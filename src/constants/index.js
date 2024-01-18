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

const defaultMultiAccordionState = [
    {
        id: 0,
        name: "Chartoptionen",
        isExpanded: false,
    },
    {
        id: 1,
        name: "Dimensionen",
        isExpanded: false,
    },
    {
        id: 2,
        name: "Daten",
        isExpanded: false,
    },
    {
        id: 3,
        name: "Allgemein",
        isExpanded: false,
    },
    {
        id: 4,
        name: "Elemente",
        isExpanded: false,
    },
    {
        id: 5,
        name: "Titel",
        isExpanded: false,
    },
    {
        id: 6,
        name: "Achsenbeschriftung",
        isExpanded: false,
    },
    {
        id: 7,
        name: "Teilstriche und Gitternetz",
        isExpanded: false,
    },
    {
        id: 8,
        name: "Tooltip",
        isExpanded: false,
    },
    {
        id: 9,
        name: "Download",
        isExpanded: false,
    },
]

export {
    ChartOptions,
    placeholderString,
    colorSchemeOptions,
    defaultMultiAccordionState,
}