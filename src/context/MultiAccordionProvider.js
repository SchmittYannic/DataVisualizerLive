import { useState, createContext } from "react";

const initContextState = {
    multiAccordionsState: [],
    toggleAccordionStateIsExpanded: () => {},
}

export const MultiAccordionContext = createContext(initContextState);

export const MultiAccordionProvider = ({children}) => {
    const [multiAccordionsState, setMultiAccordionsState] = useState([
        {
            id: 0,
            name: "ChartSettings",
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
    ]);

    const toggleAccordionStateIsExpanded = (accordionState, idx) => {
        setMultiAccordionsState((prevState) => {
            const newState = [...prevState];
            const copyAccordionState = {...accordionState};
            copyAccordionState.isExpanded = !copyAccordionState.isExpanded;
            newState[idx] = copyAccordionState;
            return newState
        })
    };

    return (
        <MultiAccordionContext.Provider 
            value={{
                multiAccordionsState,
                toggleAccordionStateIsExpanded,
            }}
        >
            {children}
        </MultiAccordionContext.Provider>
    )
}