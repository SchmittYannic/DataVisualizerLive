import { Link } from "react-router-dom"
import ClipLoader from "./ClipLoader"

const AsyncLink = ({
    isLoading,
    children,
    size=20,
    color="rgb(209,213,219)",
    ...props
}) => {
    return (
        <>
            {isLoading ? (
                <span 
                    {...props}
                >
                    <p className="hidden">
                        {children}
                    </p>
                    <div className="cliploader-centered">
                        <ClipLoader
                            color={color}
                            loading={isLoading}
                            size={size}
                        />
                    </div>       
                </span>
            ) : (
                <Link
                    {...props}
                >
                    <p className="visible">
                        {children}
                    </p>
                </Link>
            )}
        </>
    )
}

export default AsyncLink