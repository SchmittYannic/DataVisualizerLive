import { useEffect, useRef } from "react";

//inspired by: https://codepen.io/regchiu/pen/PMpmBK
const TableScroll = ({ data, batchSize=20, tableHeight="300px" }) => {
    const infiniteTableRef = useRef(null); //div wrapping the table element
    const tableRef = useRef(null); //table element wrapped by infiniteTableRef
    const dataKeys = Object.keys(data[0]); //Array of the keys of the data -> column header
    const dataLength = data.length;
    const firstBatch = dataLength > batchSize ? data.slice(0, batchSize) : data; //get first batch

    useEffect(() => {
        //save ref.current in constants
        const tableElement = tableRef.current;
        const infTabEl = infiniteTableRef.current;
        //variable saving the current amount of entries loaded inside the table
        //initialized using the batchSize
        let loadedEntries = batchSize;

        //event handler function
        const handleScroll = () => {
            //bool determining if bottom of table was reached by scrolling
            //important to make sure there is no horizontal scrollbar on the div.
            const isButtomReached = Math.abs(infTabEl.scrollHeight - infTabEl.clientHeight - infTabEl.scrollTop) < 1;
            //if bottom was reached -> loadMoreEntries
            if (isButtomReached) loadMoreEntries();
        };

        //function inserts/loads more Entries into the table
        const loadMoreEntries = () => {
            //newEndPoint of the table equals the current amount of entries loaded + batchSize to be loaded now
            const newEndPoint = loadedEntries + batchSize;
            //Array newEntries taking a new slice of data to be loaded next
            const newEntries = dataLength > newEndPoint 
                ? data.slice(loadedEntries, newEndPoint) 
                : data.slice(loadedEntries, dataLength);
            //iterate through the array
            newEntries.forEach((entry, idx) => {
                //for every new entry insert a new row into the table
                const row = tableElement.insertRow(-1);
                //first cell displays the row number
                row.insertCell(0).innerHTML = loadedEntries+idx+1;
                //iterate through all the keys
                dataKeys.forEach((key, idx) => {
                    //display the value of entry inside a new cell
                    row.insertCell(idx+1).innerHTML = entry[key];
                })
            });
            //update loadedEntries with the new Endpoint
            loadedEntries = newEndPoint;
        }; 

        //add scroll eventlistener to the table wrapping div
        if (infTabEl) infTabEl.addEventListener("scroll", handleScroll);

        //clean up scroll eventlistener of the table wrapping div
        return () => infTabEl.removeEventListener("scroll", handleScroll);
    }, [data, batchSize, dataKeys, dataLength]);

    return (
        <div ref={infiniteTableRef} className="infinite-table" style={{ overflowY: "scroll", height: tableHeight }}>
            <table ref={tableRef}>
                <thead>
                    <tr>
                        <th></th>
                        {Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {firstBatch.map((row, key) => 
                        <tr key={key}>
                            <td>{key + 1}</td>
                            {Object.entries(row).map(([key, value]) => <td key={key}>{value}</td>)}
                        </tr>                                   
                    )}
                </tbody>
            </table>
        </div>
    )
};

export default TableScroll;