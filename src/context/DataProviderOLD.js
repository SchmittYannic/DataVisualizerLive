import axios from "axios";
import { createContext, useEffect, useState } from "react";

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
    dataSnipped: [],
    setDataSnipped: () => {},
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
};

export const DataContext = createContext(initContextState);

export const DataProvider = ({children}) => {
    const [sessionId, setSessionId] = useState(null);

    const [fileIsUploaded, setFileIsUploaded] = useState(false);
    const [dataAsJSON, setDataAsJSON] = useState([]);
    const [dataAsJSONLength, setDataAsJSONLength] = useState(0);
    const [dataSnipped, setDataSnipped] = useState([]);

    const [catColumns, setCatColumns] = useState([]);
    const [catColumnsLength, setCatColumnsLength] = useState(0);
    const [numColumns, setNumColumns] = useState([]);
    const [numColumnsLength, setNumColumnsLength] = useState(0);
    const [dateColumns, setDateColumns] = useState([]);
    const [dateColumnsLength, setDateColumnsLength] = useState(0);

    const [catOptions, setCatOptions] = useState([]);
    const [dateOptions, setDateOptions] = useState([]);
    const [dataCopy, setDataCopy] = useState([]);

    //When Component first mounts set sessionId
    useEffect(() => {
        //if there is no sessionId in sessionStorage
        if (!sessionStorage.getItem("sessionId")) {
            //set a new session with a backend request
            axios
                .get("/setsession")
                .then((res) => {
                    sessionStorage.setItem("sessionId", res.data);
                    setSessionId(res.data);
                })
                .catch((err) => console.log("setsession error in DataProvider"));
        } else {
            //else use the seasonId in sessionStorage to set sessionId state
            setSessionId(sessionStorage.getItem("sessionId"));
        }
    }, [])

    //Whenever sessionId updates check if uploaded file is present
    //this is done so in case of a page refresh the app knows if a file was uploaded already
    useEffect(() => {
        axios
            .post("/filePathSet", {sessionId: sessionId})
            .then((res) => {
                if (res.data.success === true) setFileIsUploaded(res.data.response);
                if (res.data.success === false) {
                    setFileIsUploaded(false)
                    console.log(res.data.message);
                } 
            })
            .catch((err) => console.log(err));
    }, [sessionId])

    //Whenever sessionId or state of fileIsUploaded changes request some data from backend
    useEffect(() => {
        //In case a file was uploaded request data from backend
        if (fileIsUploaded) {
            axios
                .post("/dataAsJSON", {sessionId: sessionId})
                .then((res) => {
                    if (res.data.success === false) {
                        console.log(res.data.message)
                    } else {
                        setDataAsJSON(res.data);
                    }
                })
                .catch((err) => console.log(err));

            axios
                .post("/dataSnipped", {sessionId: sessionId})
                .then((res) => {
                    if (res.data.success === false) {
                        console.log(res.data.message)
                    } else {
                        setDataSnipped(res.data);
                    }
                })
                .catch((err) => console.log(err));
            
            axios
                .post("/categoricalColumns", {sessionId: sessionId})
                .then((res) => {
                    if (res.data.success === false) {
                        console.log(res.data.message)
                    } else {
                        setCatColumns(res.data);
                    }
                })
                .catch((err) => console.log(err));

            axios
                .post("/numericalColumns", {sessionId: sessionId})
                .then((res) => {
                    if (res.data.success === false) {
                        console.log(res.data.message)
                    } else {
                        setNumColumns(res.data);
                    }
                })
                .catch((err) => console.log(err));
                
            axios
                .post("/datetimeColumns", {sessionId: sessionId})
                .then((res) => {
                    if (res.data.success === false) {
                        console.log(res.data.message)
                    } else {
                        setDateColumns(res.data);
                    }
                })
                .catch((err) => console.log(err));
        }
    }, [fileIsUploaded, sessionId]);

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
                sessionId,
                fileIsUploaded, 
                setFileIsUploaded, 
                dataAsJSON,
                dataAsJSONLength,
                dataSnipped,
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
};