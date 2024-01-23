import React from "react"
import "./ClipLoader.css"

const ClipLoader = ({
    loading,
    color="black",
    size=20,
}) => {
    return (
        <>
            {loading && (
                <div
                    className="cliploader"
                    style={{
                        width: size + "px",
                        height: size + "px",
                    }}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                >
                    <div 
                        className="cliploader-section"
                        style={{
                            borderTopColor: color,
                            borderLeftColor: color,
                            borderBottomColor: color,
                            animationDuration: "1.5s",
                        }}
                    />
                </div>
            )}
        </>
    )
}

export default ClipLoader