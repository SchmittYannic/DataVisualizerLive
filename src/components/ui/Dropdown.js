import { useState, useRef, useEffect, useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MdKeyboardArrowDown } from "react-icons/md";

import "./Dropdown.css";

const Dropdown = ({ OptionsList, selectedOption, setSelectedOption, searchable=false, label, children }) => {
    const comboboxId = useId();
    const listboxId = useId();
    const labelId = useId();
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(selectedOption);
    const [filteredOptions, setFilteredOptions] = useState(OptionsList);
    const [focusedOption, setFocusedOption] = useState(filteredOptions.indexOf(selectedOption));
    const optionContainer = useRef(null);

    const selectedOptionDisplay = typeof(selectedOption) === "object" ? selectedOption.current : selectedOption;

    const closeDropdown = () => {
        setFilteredOptions(OptionsList);
        setIsOpen(false);
    };

    const handleKeyDown = (e) => {
        const { key } = e;
        const optionsLength = filteredOptions.length;
        let nextIndexCount = 0;

        if (key === "ArrowDown") {
            e.preventDefault();
            nextIndexCount = (focusedOption + 1) % optionsLength;
            setFocusedOption(nextIndexCount);
        }

        if (key === "ArrowUp") {
            e.preventDefault();
            nextIndexCount = (focusedOption + optionsLength - 1) % optionsLength;
            setFocusedOption(nextIndexCount);
        }

        if (key === "Enter") {
            e.preventDefault();
            if (isOpen) {
                if (focusedOption !== -1) {
                    const currentlyFocusedOption = typeof(filteredOptions[focusedOption]) === "object" ? filteredOptions[focusedOption].action : filteredOptions[focusedOption];
                    setSelectedOption(currentlyFocusedOption);
                    if (searchable) setInputValue(currentlyFocusedOption);
                    closeDropdown();
                }
                //setIsOpen(false);
            } else {
                setIsOpen(true);
            }
        }

        // if (key === "Tab") {
        //     if (isOpen) {
        //         //e.preventDefault();
        //         //handleBlur();
        //     }
        // }
    };

    const handleOnInputClick = () => {
        if (isOpen) {
            handleBlur();
        } else {
            setIsOpen(true);
        }
    };

    const handleInputChange = (e) => {
        const { value } = e.target;
        const filteredOptions = OptionsList.filter((option) => option.toLowerCase().includes(value.toLowerCase()))
        
        setIsOpen(true);
        setFilteredOptions(filteredOptions)
        setInputValue(value);
        setFocusedOption(-1);
    };

    const handleOnOptionClicked = (input) => {
        setFocusedOption(filteredOptions.indexOf(input));
        setSelectedOption(input);
        if (searchable) setInputValue(input);
        setIsOpen(false);
    }

    const handleBlur = () => {
        if (isOpen) {
            if (OptionsList.includes(inputValue)) {
                setSelectedOption(inputValue);
            } else {
                setInputValue(selectedOption);
            }
            closeDropdown();
        }
    };

    useEffect(() => {
        if(!optionContainer.current) return;

        optionContainer.current.scrollIntoView({
            block: "center",
        });
    }, [focusedOption]);

    return (
        <>
            <label id={labelId} htmlFor={comboboxId}>{label}</label>
            <div className="dropdown-container">
                <div>
                    {
                        searchable 
                        ?   <label 
                                onClick={() => {
                                    document.getElementById(comboboxId).focus();
                                }}
                            >
                                <input 
                                    id={comboboxId}
                                    className="dropdown-search"
                                    type="text"
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    onClick={handleOnInputClick}
                                    onKeyDown={handleKeyDown}
                                    onBlur={handleBlur}
                                    tabIndex={0}
                                    role="combobox"
                                    aria-controls={listboxId}
                                    aria-expanded={isOpen}
                                    aria-labelledby={labelId}
                                />
                                <MdKeyboardArrowDown 
                                    className={`dropdown-button-svg ${isOpen ? "open" : ""}`} 
                                />
                            </label>
                        :
                            <button 
                                id={comboboxId}
                                type="button"
                                className="dropdown-button"
                                onClick={() => setIsOpen(!isOpen)}
                                onKeyDown={handleKeyDown}
                                onBlur={closeDropdown}
                                tabIndex={0}
                                role="combobox"
                                aria-controls={listboxId}
                                aria-expanded={isOpen}
                                aria-labelledby={labelId}
                            >
                                {
                                    children 
                                        ? children 
                                        : selectedOptionDisplay
                                }
                                <MdKeyboardArrowDown 
                                    className={`dropdown-button-svg ${isOpen ? "open" : ""}`} 
                                />
                            </button>
                    }
                </div>

                <AnimatePresence>
                {
                    isOpen &&
                        <motion.ul
                            id={listboxId}
                            className={`dropdown-menu`}
                            role="listbox"
                            aria-labelledby={labelId} 
                            aria-orientation="vertical"
                            initial={{opacity: 0, visibility: "hidden", scale: 0.7}}
                            animate={{opacity: 1, visibility: "visible", scale: 1}}
                            exit={{opacity: 0, visibility: "hidden", scale: 0.7}}
                            transition={{duration: 0.2}}
                        >                          
                            {filteredOptions.map((Option, idx) => {

                                const action = typeof(Option) === "object" ? Option.action : Option;
                                const name = typeof(Option) === "object" ? Option.name : Option;

                                return (
                                    <li 
                                        key={action}
                                        role="option"
                                        aria-selected={action === selectedOptionDisplay}
                                    >
                                        <button
                                            className={`dropdown-menu-content ${typeof(selectedOption) === "object" && action === selectedOptionDisplay ? "active" : ""} ${typeof(selectedOption) !== "object" && action === selectedOptionDisplay ? "active" : ""} ${idx === focusedOption ? "focused" : ""}`} 
                                            ref={idx === focusedOption ? optionContainer : null}
                                            type="button"
                                            onMouseDown={() => handleOnOptionClicked(action)}
                                            tabIndex={-1}
                                        >
                                            {name}
                                        </button>
                                    </li>
                                )
                            })}                          
                        </motion.ul>
                }
                </AnimatePresence>
            </div>
        </>
    )
};

export default Dropdown;