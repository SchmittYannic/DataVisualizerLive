import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Homepage, Header } from "components";
import { UploadStep, DataStep, VisualizationStep } from "features/datavisualizer";
import ScrollToTop from "components/ScrollToTop";

export const steps = [
    {
        stepcount: 1,
        label: "Upload",
        component: UploadStep,
        path: "/DataVisualizer/UploadStep",
    },
    {
        stepcount: 2,
        label: "Datenansicht",
        component: DataStep,
        path: "/DataVisualizer/DataStep",
    },
    {
        stepcount: 3,
        label: "Visualisierung",
        component: VisualizationStep,
        path: "/DataVisualizer/VisualizationStep",
    },
]

const App = () => {
    return (
        <Router>
            <ScrollToTop>
                <Routes>
                    <Route exact path="/*" element={<Homepage />}/>
                    {steps.map((step, idx) => (
                        <Route key={idx} path={step.path} element={<><Header /><step.component /></>}/>
                    ))}
                </Routes>
            </ScrollToTop>
        </Router>
    )
}

export default App;