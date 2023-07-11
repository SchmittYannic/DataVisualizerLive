import { useId, useState } from "react";

const RangeInput = (props) => {
    const { title, min, max, defaultValue, onChange, label } = props;
    const inputId = useId();
    const [inputValue, setInputValue] = useState(defaultValue);

    const handleChange = (e) => {
        const inputEl = e.target;

        setInputValue(inputEl.valueAsNumber);
        onChange(inputEl.valueAsNumber);
    }

    return (
        <>
            <label htmlFor={inputId}>
                {label}
                <br/>
                <span>{inputValue / 100}</span>
            </label>
            <input 
                id={inputId}
                type="range"
                title={title}
                min={min}
                max={max}
                value={inputValue}
                onChange={handleChange}
            />
        </>
    )
};

export default RangeInput;