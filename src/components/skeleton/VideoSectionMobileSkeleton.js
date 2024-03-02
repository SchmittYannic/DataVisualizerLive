import Skeleton from "components/skeleton/Skeleton";
import useWindowSize from "hooks/useWindowSize";
import "components/VideoSectionMobile.css";

const VideoSectionMobileSkeleton = () => {

    const windowSize = useWindowSize();
    const isMobile = windowSize.width <= 680;

    const activeTabWidth = isMobile ? 215 : 350;
    const inactiveTabWidth = 50;

    return (
        <>
            <h2>
                <Skeleton height="3rem" width="300px" />
            </h2>

            <div className="tabs">
                <div className="tab active" style={{ width: `${activeTabWidth}px` }}>
                    <Skeleton height="24px" width="70px" />
                </div>
                <div className="tab" style={{ width: `${inactiveTabWidth}px` }}>
                    <Skeleton height="24px" width="12px" />
                </div>
                <div className="tab" style={{ width: `${inactiveTabWidth}px` }}>
                    <Skeleton height="24px" width="12px" />
                </div>
            </div>

            <div className="video-section-content">
                <div className="video-section-text">
                    <div className="skeleton-paragraph">
                        <Skeleton height="24px" width="100%" />
                        <Skeleton height="24px" width="100%" />
                        <Skeleton height="24px" width="100%" />
                        <Skeleton height="24px" width="100%" />
                        <Skeleton height="24px" width="100%" />
                        <Skeleton height="24px" width="80%" />
                    </div>
                </div>
                <div className="image-section-image-wrapper">
                    <Skeleton height="920px" width="480px" />
                </div>
            </div>
        </>
    )
}

export default VideoSectionMobileSkeleton