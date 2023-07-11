import { useContext } from "react";
import { FontContext } from "../context/FontProvider";

const useFontContext = () => {
    return useContext(FontContext);
};

export default useFontContext;