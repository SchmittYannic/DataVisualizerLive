import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { steps } from "App";
import { useData, useScrollTracker } from "hooks";
import "./ProgressSteps.css";

const ProgressSteps = () => {
    //inspired by: https://www.codevertiser.com/creating-reusable-progress-steps-component-in-reactjs/
    const userScrollingAction = useScrollTracker();
    const { fileIsUploaded } = useData();
    const [activeStep, setActiveStep] = useState(1);
    const currentUrlPathname = window.location.pathname;

    const totalSteps = steps.length;

    useEffect(() => {
        steps.forEach((step) => {
            if (currentUrlPathname === step.path) setActiveStep(step.stepcount);
        })
    }, [currentUrlPathname]);
    
    return (
        <div className={`progress-steps ${userScrollingAction === "up" ? "fixed" : ""}`}>
            <div className="step-container">
                {steps.map((step, idx) => (
                    <div key={idx} className="step-wrapper">
                        <div
                            className="step-style" 
                            style={{ 
                                border: `${activeStep >= step.stepcount ? "3px solid var(--action-color)" : "3px solid var(--action-color-light)"}`
                            }}
                        >
                            {activeStep > step.stepcount ? (
                                <div className="checkmark">
                                    L
                                </div>
                            ) : (
                                <div className="step-count">
                                    {step.stepcount}
                                </div>
                            )}
                        </div>
                        <div className="steps-label-container">
                            {
                                fileIsUploaded === false && step.stepcount !== 1
                                ?   <span className="disabled-link">{step.label}</span>
                                :   <Link
                                        className="link"
                                        title={step.label === "Upload" ? `Weiter zum ${step.label}` : `Weiter zur ${step.label}`}
                                        to={step.path}
                                    >
                                        {step.label}
                                    </Link>
                            }
                        </div>
                    </div>
                ))}
                <div 
                    className="progress-line" 
                    style={{ width: `${(100 / (totalSteps - 1)) * (activeStep - 1)}%`}} 
                />
            </div>
        </div>
    )
};

export default ProgressSteps;