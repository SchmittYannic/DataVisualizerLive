import { useState } from "react";
import { SketchPicker } from "react-color";
import reactCSS from "reactcss";

//source: https://casesandberg.github.io/react-color/
const MyColorPicker = ({ color, setColor, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [colorState, setColorState] = useState(color)

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    const handleClose = () => {
        setIsOpen(false);
        setColor(colorState);
    };

    const handleChange = (color) => {
        setColorState(color.rgb);
    };

    const styles = reactCSS({
        'default': {
            color: {
                width: "100%",
                height: '20px',
                borderRadius: '2px',
                background: `rgba(${colorState.r}, ${colorState.g}, ${colorState.b}, ${colorState.a})`,
            },
            swatch: {
                display: 'inline-block',
            },
            popover: {
                position: 'absolute',
                zIndex: '2',
            },
            cover: {
                position: 'fixed',
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px',
            },
        },
    });

    return (
        <>
            <label>{label}</label>
            <div>
                <button
                    className="btn full"
                    type="button" 
                    style={ styles.swatch } 
                    onClick={ handleClick }
                >
                    <div style={ styles.color } />
                </button>
                { 
                    isOpen ? 
                        <div style={ styles.popover }>
                            <div style={ styles.cover } onClick={ handleClose }/>
                            <SketchPicker color={ colorState } onChange={ handleChange } />
                        </div> 
                        : null 
                }

            </div>
        </>
    )
};

export default MyColorPicker