import { motion, useCycle } from "framer-motion";
import { hpchart1, hpchart2, hpchart3, hpchart4, hpchart5 } from "../assets/";
import { useEffect } from "react";

const images = [hpchart1, hpchart2, hpchart3, hpchart4, hpchart5];

const orderA = [1, 2, 3, 4, 5];
const orderB = [2, 3, 4, 5, 1];
const orderC = [3, 4, 5, 1, 2];
const orderD = [4, 5, 1, 2, 3];
const orderE = [5, 1, 2, 3, 4];

const position = [0, 25, 50, 75, 100];

//https://framerbook.com/animation/example-animations/33-layout-animation/
const HeroChartAnimation = () => {
    const [order, setOrder] = useCycle(orderE, orderD, orderC, orderB, orderA);

    useEffect(() => {
        const timer = setTimeout(() => {
            setOrder();
        }, 5000);

        return () => clearTimeout(timer);
    }, [order, setOrder])

    return (
        <div className="auto-chart-carousel">
            {order.map((item, idx) => {
                return (
                    <motion.div 
                        className="chart-img-wrapper"
                        style={{
                            top: position[idx],
                            right: position[idx],
                        }}
                        key={item}
                        layout                     
                    >
                        <img src={images[item - 1]} alt="" />
                    </motion.div>
                )
            })}
        </div>
    )
}

export default HeroChartAnimation