import Skeleton from "components/skeleton/Skeleton";
import "components/VideoSection.css";

const VideoSectionSkeleton = () => (
    <>
        <h2>
            <Skeleton height="3rem" width="800px" />
        </h2>

        <div className="tabs">
            <div className="tab">
                <Skeleton height="24px" width="120px" />
            </div>
            <div className="tab">
                <Skeleton height="24px" width="120px" />
            </div>
            <div className="tab">
                <Skeleton height="24px" width="120px" />
            </div>
        </div>

        <div className="video-section-content">
            <div className="video-section-text">
                <div className="skeleton-paragraph">
                    <Skeleton height="24px" width="1024px" />
                    <Skeleton height="24px" width="1024px" />
                    <Skeleton height="24px" width="800px" />
                </div>
            </div>
            <div className="video-section-video-wrapper">
                <Skeleton height="768px" width="1024px" />
            </div>
        </div>
    </>
)

export default VideoSectionSkeleton