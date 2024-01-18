import { useContext } from "react";
import { MultiAccordionContext } from "../context/MultiAccordionProvider";

const useMultiAccordionContext = () => {
    return useContext(MultiAccordionContext);
};

export default useMultiAccordionContext;