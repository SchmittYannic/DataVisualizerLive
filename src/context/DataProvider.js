import { useState, createContext, useEffect } from "react";
import { AutoData, catColumnsAuto, numColumnsAuto, dateColumnsAuto } from "../data/AutoData";
import { WetterData, catColumnsWetter, numColumnsWetter, dateColumnsWetter } from "../data/WetterData";
import { placeholderString } from "../constants";

const initContextState = {
    sessionId: null,
    setSessionId: () => {},
    fileIsUploaded: false,
    setFileIsUploaded: () => {},
    dataAsJSON: [],
    setDataAsJSON: () => {},
    dataAsJSONLength: 0,
    setDataAsJSONLength: () => {},
    catColumns: [],
    setCatColumns: () => {},
    catColumnsLength: 0,
    setCatColumnsLength: () => {},
    numColumns: [],
    setNumColumns: () => {},
    numColumnsLength: 0,
    setNumColumnsLength: () => {},
    dateColumns: [],
    setDateColumns: () => {},
    dateColumnsLength: 0,
    setDateColumnsLength: () => {},
    catOptions: [],
    setCatOptions: () => {},
    dateOptions: [],
    setDateOptions: () => {},
    dataCopy: [],
    setDataCopy: () => {},
}

export const DataContext = createContext(initContextState);

export const DataProvider = ({children}) => {
    const [fileIsUploaded, setFileIsUploaded] = useState(false);
    const [demodata, setDemodata] = useState("");

    const [dataAsJSON, setDataAsJSON] = useState([]);
    const [dataAsJSONLength, setDataAsJSONLength] = useState(0);

    const [catColumns, setCatColumns] = useState([]);
    const [catColumnsLength, setCatColumnsLength] = useState(0);
    const [numColumns, setNumColumns] = useState([]);
    const [numColumnsLength, setNumColumnsLength] = useState(0);
    const [dateColumns, setDateColumns] = useState([]);
    const [dateColumnsLength, setDateColumnsLength] = useState(0);

    const [catOptions, setCatOptions] = useState([]);
    const [dateOptions, setDateOptions] = useState([]);
    const [dataCopy, setDataCopy] = useState([]);

    useEffect(() => {
        if(demodata === "useAutoData"){
            setDataAsJSON(AutoData);
            setCatColumns(catColumnsAuto);
            setNumColumns(numColumnsAuto);
            setDateColumns(dateColumnsAuto);
        }
        if(demodata === "useWetterData"){
            setDataAsJSON(WetterData);
            setCatColumns(catColumnsWetter);
            setNumColumns(numColumnsWetter);
            setDateColumns(dateColumnsWetter);
        }
    }, [demodata]);

    //calculate and set Arraylengths whenever the corresponding Array changes
    useEffect(() => {
        setDataAsJSONLength(dataAsJSON.length);
    }, [dataAsJSON]);

    useEffect(() => {
        setCatColumnsLength(catColumns.length);
    }, [catColumns]);

    useEffect(() => {
        setNumColumnsLength(numColumns.length);
    }, [numColumns]);

    useEffect(() => {
        setDateColumnsLength(dateColumns.length);
    }, [dateColumns]);

    //create a copy of catColumns called catOptions, which includes a placeholderString.
    useEffect(() => {
        const catOptions = JSON.parse(JSON.stringify(catColumns));
        if (!catOptions.includes(placeholderString)) catOptions.unshift(placeholderString);
        setCatOptions(catOptions);
    }, [catColumns])

    /* Creates a copy of dataAsJSON saved as dataCopy.
    Creates a copy of dataColumn saved as dataOptions.
    Parses all the entries of the dateColumns into Date types
    to see if a column has indeed only dates inside.
    If an entry cant be parsed into a Date the column is removed from dateOptions */
    useEffect(() => {
        if (dateColumnsLength > 0) {
            const data = JSON.parse(JSON.stringify(dataAsJSON));
            const dateOptions = JSON.parse(JSON.stringify(dateColumns));

            data.forEach(d => {
                let isDate = true;
                let invalidColumnIndex = [];
                for (let i = 0; i < dateColumnsLength; i++){
                    d[dateColumns[i]] = Date.parse(d[dateColumns[i]]);
                    
                    if(isNaN(d[dateColumns[i]])){
                        isDate = false;
                        invalidColumnIndex.push(i);
                    }
                }

                for (let i = 0; i < invalidColumnIndex.length; i++){
                    if(isDate === false){
                        dateOptions.splice(invalidColumnIndex[i], 1);
                    }
                }
            });

            setDateOptions(dateOptions);
            setDataCopy(data);
        }
    }, [dataAsJSON, dateColumns, dateColumnsLength]);

    return (
        <DataContext.Provider 
            value={{
                fileIsUploaded,
                setFileIsUploaded,
                demodata,
                setDemodata,
                dataAsJSON,
                dataAsJSONLength,
                catColumns,
                catColumnsLength,
                numColumns,
                numColumnsLength,
                dateColumns,
                dateColumnsLength,
                catOptions,
                dateOptions,
                dataCopy,
            }}
        >
            {children}
        </DataContext.Provider>
    )
}