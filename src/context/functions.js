import { DataFrame, toJSON } from "danfojs";

const fetchTestData = async (datasetName, callback) => {
    if (datasetName === "useAutoData") {
        try {
            const response = await fetch(`${process.env.PUBLIC_URL}/data/AutoData.json`);
            const AutoData = await response.json();
            const df = new DataFrame(AutoData);
            callback(df);
        } catch (err) {
            console.log("Error occured loading AutoData");
        }
    } else if (datasetName === "useWetterData") {     
        try {
            const response = await fetch(`${process.env.PUBLIC_URL}/data/WetterData.json`);
            const WetterData = await response.json();
            const df = new DataFrame(WetterData);
            callback(df);
        } catch (err) {
            console.log("Error occured loading AutoData");
        }        
    }
}

const dataFrameToJSON = (dataframe, callback) => {
    callback(toJSON(dataframe));
};

export {
    fetchTestData,
    dataFrameToJSON,
}