import { toJSON, DataFrame } from "danfojs";
import { useState, createContext, useEffect } from "react";
import { AutoData } from "../data/AutoData";
import { WetterData } from "../data/WetterData";
import { placeholderString } from "../constants";

const initContextState = {
    fileIsUploaded: false,
    setFileIsUploaded: () => {},
    demodata: "",
    setDemodata: () => {},
    dataframe: null,
    setDataframe: () => {},
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
    operations: {},
    setOperations: () => {},
    isLoading: false,
    setIsLoading: () => {},
};

export const DataContext = createContext(initContextState);

export const DataProvider = ({children}) => {
    const [fileIsUploaded, setFileIsUploaded] = useState(false);
    const [demodata, setDemodata] = useState("");
    const [dataframe, setDataframe] = useState(null);
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

    const [operations, setOperations] = useState({
        setDataframe: false,
        setJSONLength: false,
        setCatOptions: false,
        setDateOptions: false,
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (demodata === "useAutoData") {
            const df = new DataFrame(AutoData);
            setDataframe(df);
        }
        if(demodata === "useWetterData"){
            const df = new DataFrame(WetterData);
            setDataframe(df);
        }
    }, [demodata]);

    useEffect(() => {
        if (!dataframe) {
            setFileIsUploaded(false);
            setIsLoading(false);
            return
        }
        
        setFileIsUploaded(true);
        setDataAsJSON(toJSON(dataframe));

        const columnNames = dataframe.columns;
        const uniqueColumns = dataframe.nUnique(0).$dataIncolumnFormat;
        const dtypes = dataframe.dtypes;

        const catColumnsArray = [];
        const numColumnsArray = [];
        const dateColumnsArray = [];

        for (let column in columnNames) {
            if (uniqueColumns[column] <= 10) {
                catColumnsArray.push(columnNames[column]);
            }
            if (dtypes[column] === "int32" || dtypes[column] === "float32") {
                numColumnsArray.push(columnNames[column]);
            }
            if (dtypes[column] === "string") {
                dateColumnsArray.push(columnNames[column]);
            }
        }

        setCatColumns(catColumnsArray);
        setCatColumnsLength(catColumnsArray.length);
        setNumColumns(numColumnsArray);
        setNumColumnsLength(numColumnsArray.length);
        setDateColumns(dateColumnsArray);

        setOperations((prevState) => {
            const newState = {...prevState};
            newState.setDataframe = true;
            return newState
        });
    }, [dataframe]);

    useEffect(() => {
        if (!fileIsUploaded) return

        setDataAsJSONLength(dataAsJSON.length);

        setOperations((prevState) => {
            const newState = {...prevState};
            newState.setJSONLength = true;
            return newState
        });
    }, [dataAsJSON, fileIsUploaded]);

    //create a copy of catColumns called catOptions, which includes a placeholderString.
    useEffect(() => {
        if (!fileIsUploaded) return

        const catOptions = JSON.parse(JSON.stringify(catColumns));
        if (!catOptions.includes(placeholderString)) catOptions.unshift(placeholderString);
        setCatOptions(catOptions);

        setOperations((prevState) => {
            const newState = {...prevState};
            newState.setCatOptions = true;
            return newState
        });
    }, [catColumns, fileIsUploaded]);

    /* Creates a copy of dataAsJSON saved as dataCopy.
    Creates a copy of dataColumn saved as dataOptions.
    Parses all the entries of the dateColumns into Date types
    to see if a column has indeed only dates inside.
    If an entry cant be parsed into a Date the column is removed from dateOptions */
    useEffect(() => {
        if (!fileIsUploaded) return
        if (dateColumns.length === 0) return

        const data = JSON.parse(JSON.stringify(dataAsJSON));
        const dateOptions = JSON.parse(JSON.stringify(dateColumns));

        data.forEach(d => {
            let isDate = true;
            let invalidColumnIndex = [];
            for (let i = 0; i < dateColumns.length; i++){
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
        setDateColumnsLength(dateOptions.length);
        setDataCopy(data);

        setOperations((prevState) => {
            const newState = {...prevState};
            newState.setDateOptions = true;
            return newState
        });
    }, [dataAsJSON, dateColumns, fileIsUploaded]);

    useEffect(() => {
        if (!fileIsUploaded) return

        const operationsStates = Object.values(operations);
        const isOperationsDone = operationsStates.every(v => v === true);

        if (isOperationsDone) setIsLoading(!isOperationsDone);
    }, [operations, fileIsUploaded]);

    return (
        <DataContext.Provider 
            value={{
                fileIsUploaded,
                setFileIsUploaded,
                setDataframe,
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
                isLoading,
                setIsLoading,
            }}
        >
            {children}
        </DataContext.Provider>
    )
}