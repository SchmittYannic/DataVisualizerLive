import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";

const LazyHomepage = lazy(() => import("components/Homepage"));
const LazyUploadStep = lazy(() => import("features/datavisualizer/UploadStep"));
const LazyDataStep = lazy(() => import("features/datavisualizer/DataStep"));
const LazyVisualizationStep = lazy(() => import("features/datavisualizer/VisualizationStep"));
const LazyProgressSteps = lazy(() => import("components/ProgressSteps"));

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
                    <Route exact path="/*" element={<Suspense><LazyHomepage /></Suspense>}/>
                    {steps.map((step, idx) => (
                        <Route key={idx} path={step.path} element={
                            <Suspense>
                                <LazyProgressSteps />
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