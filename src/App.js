import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Homepage, ProgressSteps } from "components";
import ScrollToTop from "components/ScrollToTop";

const LazyUploadStep = lazy(() => import("features/datavisualizer/UploadStep"));
const LazyDataStep = lazy(() => import("features/datavisualizer/DataStep"));
const LazyVisualizationStep = lazy(() => import("features/datavisualizer/VisualizationStep"));

export const steps = [
    {
        stepcount: 1,
        label: "Upload",
        component: LazyUploadStep,
        path: "/DataVisualizer/UploadStep",
    },
    {
        stepcount: 2,
        label: "Datenansicht",
        component: LazyDataStep,
        path: "/DataVisualizer/DataStep",
    },
    {
        stepcount: 3,
        label: "Visualisierung",
        component: LazyVisualizationStep,
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
                        <Route key={idx} path={step.path} element={
                            <Suspense>
                                <ProgressSteps />
                                <step.component />
                            </Suspense>
                        }/>
                    ))}
                </Routes>
            </ScrollToTop>
        </Router>
    )
}

export default App;