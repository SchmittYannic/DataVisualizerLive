import { useRef, useState } from "react";
import { useDragControls, motion } from "framer-motion";
import { RiDragMove2Fill } from "react-icons/ri";

import { ChartSettings, BackButton } from "features/chartsettings";
import { useData } from "hooks";
import { navigationTabName } from "constants";

const ChartSettingsDesktop = ({ settingsRef, setSelectedChart, setDimensions, setIsOpen }) => {
    const { dataAsJSONLength } = useData();
    const controls = useDragControls();
    const draggableRef = useRef(null);

    const [activeTab, setActiveTab] = useState(navigationTabName);

    // get body and html element
    const body = document.body;
    const html = document.documentElement;
    //calculate maxHeight and maxWidth to use as dragConstraints
    const maxHeight = Math.max( body.scrollHeight, body.offsetHeight, 
        html.clientHeight, html.scrollHeight, html.offsetHeight );
    const maxWidth = Math.max( body.scrollWidth, body.offsetWidth,
        html.clientWidth, html.scrollWidth, html.offsetWidth );

    //default position of chart-settings container
    const settingsDefaultPosition = {
        y: body.scrollHeight / 2 - 380, 
        x: body.scrollWidth / 2 - 200
    };
    //initialize settingsCurrentPosition
    const settingsCurrentPosition = {
        y: 0,
        x: 0,
    };

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
        settingsCurrentPosition.x = matchTranslateX ? matchTranslateX[1] : 0;
        settingsCurrentPosition.y = matchTranslateY ? matchTranslateY[1] : 0;
    };

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
                    bottom: maxHeight - 760,
                    right: maxWidth- 400,
                }}
                dragElastic={0}
                initial={{ 
                    opacity: 1,
                    x: settingsDefaultPosition.x,
                    y: settingsDefaultPosition.y,
                }}
                exit={{ 
                    opacity: 0, 
                    x: body.scrollWidth/2 - settingsCurrentPosition.x,
                    y: body.scrollHeight/2 - settingsCurrentPosition.y,
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