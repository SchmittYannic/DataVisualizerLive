import { useEffect, useRef, useState } from "react";
import { useDragControls, motion } from "framer-motion";
import { RiDragMove2Fill } from "react-icons/ri";

import ChartSettings from "features/chartsettings/ChartSettings";
import BackButton from "features/chartsettings/BackButton";
import { useData } from "hooks";
import { navigationTabName } from "constants";

const ChartSettingsDesktop = ({ settingsCurrentPosition, settingsRef, setSelectedChart, setDimensions, setIsOpen }) => {
    const { dataAsJSONLength } = useData();
    const controls = useDragControls();
    const draggableRef = useRef(null);

    const [activeTab, setActiveTab] = useState(navigationTabName);

    const settingsWidth = Number(getComputedStyle(document.documentElement).getPropertyValue("--desktop-chart-settings-width"));
    const settingsHeight = Number(getComputedStyle(document.documentElement).getPropertyValue("--desktop-chart-settings-height"));

    // get body and html element
    const body = document.body;
    const html = document.documentElement;
    //calculate maxHeight and maxWidth to use as dragConstraints
    const maxHeight = Math.max( body.scrollHeight, body.offsetHeight, 
        html.clientHeight, html.scrollHeight, html.offsetHeight );
    const maxWidth = Math.max( body.scrollWidth, body.offsetWidth,
        html.clientWidth, html.scrollWidth, html.offsetWidth );

    const initialXPosition = !settingsCurrentPosition.current ? 0 
        : settingsCurrentPosition.current.x + settingsWidth < body.scrollWidth ? settingsCurrentPosition.current.x 
        : body.scrollWidth - settingsWidth;

    const initialYPosition = !settingsCurrentPosition.current ? 0 
        : settingsCurrentPosition.current.y + settingsHeight < body.scrollHeight ? settingsCurrentPosition.current.y 
        : body.scrollHeight - settingsHeight;

    const startDrag = (event) => {
        controls.start(event)
    };

    const handleDragableClose = () => {
        setIsOpen((prev) => !prev);

        //get current transform style of draggable element chart-settings
        //string looks like this: translateX(1265px) translateY(138.309px) translateZ(0px)
        const string = draggableRef.current.style.transform;
        //use regex to get the values inside the translateX and translateY parentheses
        const regexTranslateX = /translateX\((.*?)px\)/;
        const regexTranslateY = /translateY\((.*?)px\)/;
        const matchTranslateX = string.match(regexTranslateX);
        const matchTranslateY = string.match(regexTranslateY);
        //save the current position of settings
        settingsCurrentPosition.current = {
            x: matchTranslateX ? Number(matchTranslateX[1]) : 0,
            y: matchTranslateY ? Number(matchTranslateY[1]) : 0,
        }
    };

    // force settings to close when window resizes. Window resize messes with the dragConstraints
    // fix is to rerender the ChartSettings
    useEffect(() => {
        const forceSettingsClose = () => {
            setIsOpen(false)
        };

        window.addEventListener("resize", forceSettingsClose);

        return () => window.removeEventListener("resize", forceSettingsClose)
    }, [setIsOpen]);

    if (dataAsJSONLength > 0) {
        return (
            <motion.div
                className="chart-settings"
                ref={draggableRef}
                drag
                dragControls={controls}
                dragListener={false}
                dragConstraints={{
                    top: 0,
                    left: 0,
                    bottom: maxHeight - settingsHeight,
                    right: maxWidth - settingsWidth,
                }}
                dragElastic={0}
                initial={{ 
                    opacity: 1,
                    x: initialXPosition,
                    y: initialYPosition,
                }}
                exit={{ 
                    opacity: 0, 
                    x: body.scrollWidth/2 - settingsWidth/2,
                    y: body.scrollHeight - settingsHeight,
                }}
                transition={{ duration: 1}}
            >
                <div className="draggable-wrapper">
                    <div 
                        className="draggable" 
                        onPointerDown={startDrag}>
                        {activeTab === navigationTabName ? (
                            <div className="draggable-icon">
                                <RiDragMove2Fill
                                    role="graphics-symbol"
                                    aria-label="Drag des Menüs möglich"
                                />
                            </div>
                        ): (
                            <div className="draggable-back-btn">
                                <BackButton onClick={() => setActiveTab(navigationTabName)} />
                            </div>
                        )}
                        
                        {activeTab}
                    </div>

                    <button 
                        className="draggable-close"
                        type="button"
                        title="Diagrammkonfiguration schließen"
                        onClick={handleDragableClose}
                    />
                </div>
                
                <div className="draggable-menu-content">
                    <ChartSettings 
                        settingsRef={settingsRef}
                        setSelectedChart={setSelectedChart}
                        setDimensions={setDimensions}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                </div>
            </motion.div>
        )
    } else {
        return <></>
    }
};

export default ChartSettingsDesktop