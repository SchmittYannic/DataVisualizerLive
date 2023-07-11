import "./SectionA.css";

const SectionA = ({ layout, img, children }) => {
    return (
        <section className={`sectionA-${layout}`}>
            <div className="sectionA-wrapper">
                <div className="sectionA-text">
                    {children}
                </div>
            </div>
            <div className="sectionA-wrapper">
                <div className="sectionA-img-wrapper">
                    <img src={img} alt="Upload Schritt" />
                </div>
            </div>
        </section>
    )
};

export default SectionA;