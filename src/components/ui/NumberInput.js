import{ useState, useId } from "react";

const NumberInput = (props) => {
    const { title, pattern, min, max, defaultValue, onChange, label } = props;
    const inputId = useId();
    const [inputValue, setInputValue] = useState(defaultValue);

    const triggerChange = (input) => {
        onChange(input);
        setInputValue(input);
    };

    const handleChange = (e) => {
        const inputEl = e.target;
        const { rangeOverflow, rangeUnderflow } = inputEl.validity;

        if (rangeUnderflow) {
            triggerChange(inputEl.min);
        } else if (rangeOverflow) {
            triggerChange(inputEl.max);
        } else if (!isNaN(inputEl.valueAsNumber)) {
            triggerChange(inputEl.valueAsNumber);
        } else {
            setInputValue(inputEl.value);
            onChange(0);
        }
    };

    return (
        <>
            <label htmlFor={inputId}>{label}</label>
            <input 
                id={inputId}
                type="number" 
                title={title}
                min={min}
                max={max}
                pattern={pattern}
                value={Number(inputValue).toString()}
                onChange={handleChange}
                onKeyDown={(event) => {
                    //only keys working are number keys, backspace, delete and tab
                    if (!/[0-9]/.test(event.key) 
                        && event.key !== "Backspace" 
                        && event.key !== "Delete" 
                        && event.key !== "Tab") {
                        event.preventDefault();
                    }
                }}
            />
        </>
    )
};

export default NumberInput;