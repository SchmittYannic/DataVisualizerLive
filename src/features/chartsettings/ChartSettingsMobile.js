import { useEffect, useState } from "react"
import { FaArrowRight } from "react-icons/fa";
import { useAnimate, stagger } from "framer-motion";

import { useData } from "hooks";
import ChartSettings from "features/chartsettings/ChartSettings";
import { navigationTabName } from "constants";


const ChartSettingsMobile = ({ settingsRef, setSelectedChart, setDimensions }) => {

    const { dataAsJSONLength } = useData();
    
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(navigationTabName);
    const [scope, animate] = useAnimate();

    const handleExpandableSideMenuTriggerClick = () => {
        if (menuIsOpen) {
            setActiveTab(navigationTabName)
            setMenuIsOpen(false)
        } else {
            setMenuIsOpen(true);
        }
    };

    useEffect(() => {
        animate(
            "button",
            menuIsOpen
              ? { x: 0, }
              : { x: -500 },
            {
              duration: 0.2,
              delay: menuIsOpen ? stagger(0.1, { startDelay: 0.15 }) : 0,
            }
        );
    }, [menuIsOpen, animate]);

    if (dataAsJSONLength > 0) {
        return (
            <div className={`expandable-side-menu ${menuIsOpen ? "expanded" : ""}`}>
                <div className="expandable-side-menu-trigger-wrapper">
                    <button
                        className="expandable-side-menu-trigger"
                        type="button"
                        onClick={handleExpandableSideMenuTriggerClick}
                        title={`${menuIsOpen ? "Diagrammkonfiguration schließen" : "Diagrammkonfiguration öffnen"}`}
                    >
                        <FaArrowRight />
                    </button>
                </div>
                <div className="inverted-corner" />

                <div ref={scope} className="expandable-side-menu-content">
                    
                    <ChartSettings 
                        settingsRef={settingsRef}
                        setSelectedChart={setSelectedChart}
                        setDimensions={setDimensions}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                </div>

                {/* added to make sure scrollbar wont go all the way down */}
                <div className="expandable-side-menu-bottom-pad" />
            </div>
        )
    } else {
        return <></>
    }
}

export default ChartSettingsMobile